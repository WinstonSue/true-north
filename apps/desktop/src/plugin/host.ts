import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  assemblePluginCatalog,
  disposeOrder,
  materializeMain,
  type MaterializedMain,
  type PluginCatalog,
  type PluginMainContext,
  type PluginMainModule,
} from '@true-north/plugin-sdk';
import {
  StorageRegistry,
  applyPluginMigrations,
  createHostStorageRuntime,
  ensureEntitySchema,
  PluginSchemaLedger,
  resolvePluginPackageRoot,
  resolveSkillRoots,
  validateSkillRoots,
  type HostStorageRuntime,
} from '@true-north/plugin-sdk/main';
import { firstPartyPlugins, type FirstPartyPluginId } from './desktop-plugins';
import { createSqlLogger } from '../main/dev-trace';
import { User } from '../service/users/user.entity';
import { aiEntities } from '../service/ai/entities';
import { aiMigrations } from '../service/ai/migrations';
import { activityEntities } from '../service/activity/entities';
import { ActivityController, activityAiContribution, activityService } from '../service/activity';
import { emitTodayInvalidate } from '../service/activity/today-bus';
import { AgentToolRegistry } from '../service/ai/agent/tools';
import { cacheService, fingerprintPromptContext } from '../service/ai/cache/ai-suggestion-cache.service';
import { attachAiRegistries, registerHostAiInstructions } from '../service/ai/contribution';
import { PluginAiRegistry } from '../service/ai/plugin-ai.registry';
import { runtimeService } from '../service/ai/runtime';
import { AiController, conversationService, startMcpServer, stopMcpServer } from '../service/ai';
import { firstPartyMainDescriptors } from './main-loaders';
import { HOST_ACTIVITY_STORE_ID, HOST_AI_STORE_ID } from './host-ids';
import { getPluginHost, getPluginHostOptional, setActiveHost } from './active-host';

type ActivatedPlugin = {
  pluginId: string;
  module: PluginMainModule;
  materialized: MaterializedMain;
};

export class DesktopPluginHost {
  readonly storage = new StorageRegistry();
  readonly agentTools = new AgentToolRegistry();
  readonly pluginAi = new PluginAiRegistry();

  catalog: PluginCatalog | null = null;
  dataSource: DataSource | null = null;
  private hostRuntime: HostStorageRuntime | null = null;
  private activated: ActivatedPlugin[] = [];
  private published = false;

  getHostDatabasePath() {
    if (process.env.NODE_ENV === 'development') {
      return path.join(process.cwd(), 'database.sqlite');
    }
    try {
      const { app } = require('electron') as typeof import('electron');
      return path.join(app.getPath('userData'), 'true-north.db');
    } catch {
      return path.join(process.cwd(), 'true-north.db');
    }
  }

  resolvePluginSpace(pluginId: string) {
    const rootDir = this.getPluginSpaceRoot(pluginId);
    fs.mkdirSync(rootDir, { recursive: true });
    const legacyPath = this.getHostDatabasePath();
    return {
      pluginId,
      rootDir,
      legacySharedDbPath: fs.existsSync(legacyPath) ? legacyPath : undefined,
    };
  }

  private getPluginSpaceRoot(pluginId: string) {
    if (process.env.NODE_ENV === 'development') {
      return path.join(process.cwd(), 'plugin-data', pluginId);
    }
    try {
      const { app } = require('electron') as typeof import('electron');
      return path.join(app.getPath('userData'), 'plugins', pluginId);
    } catch {
      return path.join(process.cwd(), 'plugin-data', pluginId);
    }
  }

  createPluginMainContext(pluginId: string): PluginMainContext {
    return {
      pluginId,
      space: this.resolvePluginSpace(pluginId),
      activity: {
        record: async (input) => {
          await activityService.create({
            title: input.title,
            summary: input.summary,
            source: input.source as never,
            occurredAt: input.occurredAt,
            captureMessageId: input.captureMessageId,
            links: input.links.map((link) => ({
              pluginId: link.pluginId,
              entityType: link.entityType,
              entityId: link.entityId,
              role: link.role,
              label: link.label,
              uri: link.uri,
            })),
          });
        },
        unlink: async (ref) => {
          await activityService.unlinkRef(ref);
        },
        invalidateToday: () => {
          emitTodayInvalidate();
        },
      },
      cache: {
        fingerprintPromptContext,
        findMatching: (input) => cacheService.findMatching(input),
        upsert: (input) => cacheService.upsert(input),
      },
    };
  }

  private backupDatabaseOnce(databasePath: string) {
    if (!fs.existsSync(databasePath)) return;
    const backupPath = `${databasePath}.pre-plugin-platform.bak`;
    if (fs.existsSync(backupPath)) return;
    fs.copyFileSync(databasePath, backupPath);
    console.log('已备份数据库', backupPath);
  }

  async openHostDatabase() {
    const databasePath = this.getHostDatabasePath();
    this.backupDatabaseOnce(databasePath);
    const isDev = process.env.NODE_ENV === 'development';
    const dataSource = new DataSource({
      type: 'sqlite',
      database: databasePath,
      synchronize: false,
      logging: isDev ? ['query', 'error'] : undefined,
      logger: createSqlLogger(),
      maxQueryExecutionTime: isDev ? -1 : undefined,
      entities: [User, PluginSchemaLedger, ...aiEntities, ...activityEntities],
      migrations: [],
      subscribers: [],
      namingStrategy: new SnakeNamingStrategy(),
    });
    if (!dataSource.isInitialized) await dataSource.initialize();
    await ensureEntitySchema(dataSource);
    this.dataSource = dataSource;
    this.hostRuntime = createHostStorageRuntime(dataSource, undefined, { registry: this.storage });
    this.storage.bind(HOST_AI_STORE_ID, this.hostRuntime);
    this.storage.bind(HOST_ACTIVITY_STORE_ID, this.hostRuntime);
    await applyPluginMigrations(this.hostRuntime, HOST_AI_STORE_ID, aiMigrations);
  }

  private throwIfIssues(issues: Array<{ message: string }>) {
    if (!issues.length) return;
    throw new Error(issues.map((issue) => issue.message).join('\n'));
  }

  private resolveFirstPartySkillRoots(pluginId: string) {
    const meta = firstPartyPlugins[pluginId as FirstPartyPluginId];
    if (!meta) return undefined;
    const contributions = meta.manifest.contributions as {
      ai?: { skills?: Record<string, { root: string }> };
    };
    return resolveSkillRoots(
      resolvePluginPackageRoot(meta.packageName, import.meta.url),
      contributions.ai?.skills,
    );
  }

  async boot() {
    const descriptors = firstPartyMainDescriptors();
    const assembled = await assemblePluginCatalog(descriptors, { side: 'main' });
    this.throwIfIssues(assembled.issues);

    await this.openHostDatabase();

    const pending: ActivatedPlugin[] = [];
    try {
      for (const plugin of assembled.plugins) {
        if (!plugin.main) {
          throw new Error(`Plugin ${plugin.manifest.pluginId} has no main implementation`);
        }
        const handles = await plugin.main.activate(this.createPluginMainContext(plugin.manifest.pluginId));
        const materialized = materializeMain(plugin.manifest, handles);
        this.throwIfIssues(materialized.issues);
        const skillRoots = this.resolveFirstPartySkillRoots(plugin.manifest.pluginId) || materialized.skillRoots;
        materialized.skillRoots = skillRoots;
        this.throwIfIssues(validateSkillRoots(plugin.manifest.pluginId, skillRoots));
        pending.push({ pluginId: plugin.manifest.pluginId, module: plugin.main, materialized });
      }
    } catch (error) {
      for (const item of [...pending].reverse()) {
        await item.module.dispose?.();
      }
      await this.closeDatabase();
      throw error;
    }

    this.activated = pending;
    this.catalog = assembled;
    this.publish();
    return assembled;
  }

  private publish() {
    attachAiRegistries({
      agentTools: this.agentTools,
      pluginAi: this.pluginAi,
    });
    if (activityAiContribution.tools?.length) {
      this.agentTools.register(activityAiContribution.tools);
    }
    registerHostAiInstructions(activityAiContribution.agentInstructions);
    for (const item of this.activated) {
      this.pluginAi.register(item.pluginId, item.materialized);
      if (item.materialized.tools.length) this.agentTools.register(item.materialized.tools);
    }
    activityService.configureCaptureAdopters(this.activated.flatMap((item) => item.materialized.captureAdopters));
    activityService.configureToday(this.activated.flatMap((item) => item.materialized.todaySections));
    activityService.configureWorkspaceWriter({
      patch: async (messageId, payload, manager) => {
        await conversationService.patchWorkspacePayload(messageId, { payload }, manager);
      },
    });
    this.published = true;
  }

  collectIpcControllers() {
    if (!this.published || !this.catalog) {
      throw new Error('Plugin host has not published IPC handles');
    }
    return [
      { id: 'ai', routePrefix: '/ai', controller: new AiController(conversationService, runtimeService) },
      { id: 'activity', routePrefix: '/activity', controller: new ActivityController() },
      ...this.activated.flatMap((item) => item.materialized.ipc),
    ];
  }

  async dispose() {
    const order = this.catalog ? disposeOrder(this.catalog.plugins.map((plugin) => plugin.manifest)) : [];
    for (const pluginId of order) {
      const item = this.activated.find((entry) => entry.pluginId === pluginId);
      this.agentTools.unregister(this.pluginAi.unregister(pluginId));
      await item?.module.dispose?.();
    }
    this.activated = [];
    this.published = false;
    await this.stopMcp();
    await this.closeDatabase();
  }

  async closeDatabase() {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
    this.dataSource = null;
    this.hostRuntime = null;
  }

  async startMcp() {
    return startMcpServer();
  }

  async stopMcp() {
    return stopMcpServer();
  }
}

export { getPluginHost } from './active-host';

export async function bootPluginPlatform() {
  const host = new DesktopPluginHost();
  setActiveHost(host);
  try {
    await host.boot();
  } catch (error) {
    setActiveHost(null);
    throw error;
  }
  return host.catalog;
}

export async function disposePluginPlatform() {
  const host = getPluginHostOptional();
  if (!host) return;
  setActiveHost(null);
  await host.dispose();
}

export function collectIpcControllers() {
  return getPluginHost().collectIpcControllers();
}

export async function startHostMcp() {
  return getPluginHost().startMcp();
}

export async function stopHostMcp() {
  return getPluginHost().stopMcp();
}

export function getMainPluginCatalog(): PluginCatalog {
  const catalog = getPluginHost().catalog;
  if (!catalog) throw new Error('Plugin catalog is not assembled');
  return catalog;
}
