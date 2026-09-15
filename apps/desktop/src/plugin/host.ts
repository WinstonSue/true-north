import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  assemblePluginCatalog,
  disposeOrder,
  materializeMain,
  ExtensionRegistry,
  extensionPoints,
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
import { cacheService, fingerprintPromptContext } from '../service/ai/cache/ai-suggestion-cache.service';
import { attachAiRegistries, hostAiRegistrations } from '../service/ai/contribution';
import { attachMainExtensions } from './extensions';
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
  readonly extensions = new ExtensionRegistry();

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

  async openHostDatabase() {
    const databasePath = this.getHostDatabasePath();
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
        const resolvedRoots = this.resolveFirstPartySkillRoots(plugin.manifest.pluginId);
        if (resolvedRoots) {
          materialized.registrations = [
            ...materialized.registrations.filter((entry) => entry.point.id !== extensionPoints.skill.id),
            ...Object.entries(resolvedRoots).map(([localId, root]) => ({
              point: extensionPoints.skill,
              key: `${plugin.manifest.pluginId}.${localId}`,
              value: { pluginId: plugin.manifest.pluginId, localId, root },
            })),
          ];
        }
        const skillRoots = Object.fromEntries(
          materialized.registrations
            .filter((entry) => entry.point.id === extensionPoints.skill.id)
            .map((entry) => {
              const skill = entry.value as { localId: string; root: string };
              return [skill.localId, skill.root];
            }),
        );
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
    attachMainExtensions(this.extensions);
    attachAiRegistries(this.extensions);
    this.extensions.registerBatch('host', hostAiRegistrations(activityAiContribution));
    for (const item of this.activated) {
      this.extensions.registerBatch(item.pluginId, item.materialized.registrations);
    }
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
      ...this.extensions.list(extensionPoints.ipc),
    ];
  }

  async dispose() {
    const order = this.catalog ? disposeOrder(this.catalog.plugins.map((plugin) => plugin.manifest)) : [];
    for (const pluginId of order) {
      const item = this.activated.find((entry) => entry.pluginId === pluginId);
      this.extensions.unregisterOwner(pluginId);
      await item?.module.dispose?.();
    }
    this.extensions.unregisterOwner('host');
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
  attachMainExtensions(null);
}

export function collectIpcControllers() {
  return getPluginHost().collectIpcControllers();
}

export async function startHostMcp() {
  return getPluginHost().startMcp();
}
