import {
  emptyWorkflowGraph,
  validateDefinitionGraph,
  validatePublishedGraph,
  workflowDefinitionGraphSchema,
  type WorkflowDefinitionGraph,
} from '@true-north/plugin-contract';
import { workflowStore } from './storage';
import { WorkflowDefinition, WorkflowDefinitionVersion } from './entities';
import { catalogSnapshotFromManifests, hostPrimitiveCatalog, hostWorkflowCatalog } from './catalog';
import { extrasAfterOldestByKey } from './migrations';
import { getPluginHostOptional } from '../../plugin/active-host';

function parseGraph(raw: unknown): WorkflowDefinitionGraph {
  return workflowDefinitionGraphSchema.parse(raw) as WorkflowDefinitionGraph;
}

function toDto(entity: WorkflowDefinition, versions?: WorkflowDefinitionVersion[]) {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    sourceTemplateKey: entity.sourceTemplateKey,
    graph: entity.graph,
    status: entity.status,
    currentVersion: entity.currentVersion,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    versions: (versions || []).map((version) => ({
      id: version.id,
      version: version.version,
      publishedAt: version.publishedAt,
      primitivePins: version.primitivePins,
    })),
  };
}

export class WorkflowDefinitionService {
  private repo() {
    return workflowStore().getRepository(WorkflowDefinition);
  }

  private versions() {
    return workflowStore().getRepository(WorkflowDefinitionVersion);
  }

  async list() {
    const list = await this.repo().find({ order: { updatedAt: 'DESC' } });
    return list.map((item) => toDto(item));
  }

  async get(id: string) {
    const entity = await this.repo().findOneBy({ id });
    if (!entity) return null;
    const versions = await this.versions().find({ where: { definitionId: id }, order: { version: 'DESC' } });
    return toDto(entity, versions);
  }

  async create(input: { title: string; description?: string; graph?: unknown; sourceTemplateKey?: string }) {
    const graph = input.graph ? parseGraph(input.graph) : emptyWorkflowGraph();
    const issues = validateDefinitionGraph(graph);
    if (issues.length) {
      throw new Error(issues.map((issue) => issue.message).join('\n'));
    }
    const saved = await this.repo().save(
      this.repo().create({
        title: input.title.trim(),
        description: input.description,
        sourceTemplateKey: input.sourceTemplateKey,
        graph: graph as unknown as Record<string, unknown>,
        status: 'draft',
      }),
    );
    return toDto(saved);
  }

  async update(id: string, input: { title?: string; description?: string; graph?: unknown }) {
    const entity = await this.repo().findOneBy({ id });
    if (!entity) throw new Error('Workflow definition not found');
    if (input.title != null) entity.title = input.title.trim();
    if (input.description !== undefined) entity.description = input.description;
    if (input.graph) {
      const graph = parseGraph(input.graph);
      const issues = validateDefinitionGraph(graph);
      if (issues.length) throw new Error(issues.map((issue) => issue.message).join('\n'));
      entity.graph = graph as unknown as Record<string, unknown>;
      entity.status = 'draft';
    }
    return toDto(await this.repo().save(entity));
  }

  async publish(id: string) {
    const entity = await this.repo().findOneBy({ id });
    if (!entity) throw new Error('Workflow definition not found');
    const graph = parseGraph(entity.graph);
    const issues = validatePublishedGraph(graph, hostPrimitiveCatalog());
    if (issues.length) throw new Error(issues.map((issue) => issue.message).join('\n'));
    const version = (entity.currentVersion || 0) + 1;
    const pins = {
      events: [...hostPrimitiveCatalog().events],
      commands: [...hostPrimitiveCatalog().commands.keys()],
    };
    await this.versions().save(
      this.versions().create({
        definitionId: id,
        version,
        graph: graph as unknown as Record<string, unknown>,
        primitivePins: pins,
        publishedAt: new Date(),
      }),
    );
    entity.status = 'published';
    entity.currentVersion = version;
    return toDto(await this.repo().save(entity), await this.versions().find({ where: { definitionId: id } }));
  }

  async publishedGraph(definitionId: string, version?: number): Promise<{ graph: WorkflowDefinitionGraph; version: number } | null> {
    const entity = await this.repo().findOneBy({ id: definitionId });
    if (!entity?.currentVersion) return null;
    const target = version || entity.currentVersion;
    const frozen = await this.versions().findOneBy({ definitionId, version: target });
    if (!frozen) return null;
    return { graph: parseGraph(frozen.graph), version: frozen.version };
  }

  private importing: Promise<string[]> | null = null;

  async importPluginTemplates() {
    if (this.importing) return this.importing;
    this.importing = this.importPluginTemplatesOnce().finally(() => {
      this.importing = null;
    });
    return this.importing;
  }

  private async importPluginTemplatesOnce() {
    const host = getPluginHostOptional();
    const templates = catalogSnapshotFromManifests(host?.catalog?.plugins.map((plugin) => plugin.manifest) || []).templates;
    const created: string[] = [];
    for (const template of templates) {
      const matches = await this.repo().find({ where: { sourceTemplateKey: template.contributionId } });
      const extras = extrasAfterOldestByKey(matches, (item) => item.sourceTemplateKey, (item) => item.createdAt);
      if (extras.length) await this.repo().remove(extras);
      if (matches.length - extras.length > 0) continue;
      const graph = parseGraph(template.graph);
      try {
        const saved = await this.repo().save(
          this.repo().create({
            title: template.nameKey,
            description: template.descriptionKey,
            sourceTemplateKey: template.contributionId,
            graph: graph as unknown as Record<string, unknown>,
            status: 'draft',
          }),
        );
        try {
          await this.publish(saved.id);
        } catch {
          // 依赖插件未齐时保持草稿，用户可稍后发布
        }
        created.push(saved.id);
      } catch {
        // unique sourceTemplateKey: 并发导入时保留已有行
      }
    }
    return created;
  }

  catalog() {
    return hostWorkflowCatalog();
  }
}

export const workflowDefinitionService = new WorkflowDefinitionService();
