import { contributionKey, type PluginManifest, type WorkflowPrimitiveCatalog } from '@true-north/plugin-contract';
import { getPluginHostOptional } from '../../plugin/active-host';

export type CatalogPrimitive = {
  contributionId: string;
  pluginId: string;
  localId: string;
  kind: 'event' | 'command' | 'interaction' | 'workspace';
  compensate?: string;
  nameKey?: string;
};

export type CatalogTemplate = {
  contributionId: string;
  pluginId: string;
  localId: string;
  nameKey: string;
  descriptionKey?: string;
  graph: Record<string, unknown>;
};

export type WorkflowCatalogSnapshot = {
  events: CatalogPrimitive[];
  commands: CatalogPrimitive[];
  interactions: CatalogPrimitive[];
  workspaces: CatalogPrimitive[];
  templates: CatalogTemplate[];
};

export function primitiveCatalogFromManifests(manifests: PluginManifest[]): WorkflowPrimitiveCatalog {
  const events = new Set<string>();
  const commands = new Map<string, { compensate?: string }>();
  const interactions = new Set<string>();
  const workspaces = new Set<string>();
  for (const manifest of manifests) {
    for (const id of Object.keys(manifest.contributions.workflow?.events || {})) {
      events.add(contributionKey(manifest.pluginId, id));
    }
    for (const [id, spec] of Object.entries(manifest.contributions.workflow?.commands || {})) {
      commands.set(contributionKey(manifest.pluginId, id), {
        compensate: spec.compensate
          ? contributionKey(manifest.pluginId, spec.compensate)
          : undefined,
      });
    }
    for (const id of Object.keys(manifest.contributions.workflow?.interactions || {})) {
      interactions.add(contributionKey(manifest.pluginId, id));
    }
    for (const id of Object.keys(manifest.contributions.workbench?.workspaces || {})) {
      workspaces.add(contributionKey(manifest.pluginId, id));
    }
  }
  return { events, commands, interactions, workspaces };
}

export function catalogSnapshotFromManifests(manifests: PluginManifest[]): WorkflowCatalogSnapshot {
  const events: CatalogPrimitive[] = [];
  const commands: CatalogPrimitive[] = [];
  const interactions: CatalogPrimitive[] = [];
  const workspaces: CatalogPrimitive[] = [];
  const templates: CatalogTemplate[] = [];
  for (const manifest of manifests) {
    for (const id of Object.keys(manifest.contributions.workflow?.events || {})) {
      events.push({
        contributionId: contributionKey(manifest.pluginId, id),
        pluginId: manifest.pluginId,
        localId: id,
        kind: 'event',
      });
    }
    for (const [id, spec] of Object.entries(manifest.contributions.workflow?.commands || {})) {
      commands.push({
        contributionId: contributionKey(manifest.pluginId, id),
        pluginId: manifest.pluginId,
        localId: id,
        kind: 'command',
        compensate: spec.compensate,
      });
    }
    for (const id of Object.keys(manifest.contributions.workflow?.interactions || {})) {
      interactions.push({
        contributionId: contributionKey(manifest.pluginId, id),
        pluginId: manifest.pluginId,
        localId: id,
        kind: 'interaction',
      });
    }
    for (const id of Object.keys(manifest.contributions.workbench?.workspaces || {})) {
      workspaces.push({
        contributionId: contributionKey(manifest.pluginId, id),
        pluginId: manifest.pluginId,
        localId: id,
        kind: 'workspace',
      });
    }
    for (const [id, spec] of Object.entries(manifest.contributions.workflow?.templates || {})) {
      templates.push({
        contributionId: contributionKey(manifest.pluginId, id),
        pluginId: manifest.pluginId,
        localId: id,
        nameKey: spec.nameKey,
        descriptionKey: spec.descriptionKey,
        graph: spec.graph as unknown as Record<string, unknown>,
      });
    }
  }
  return { events, commands, interactions, workspaces, templates };
}

export function hostWorkflowCatalog(): WorkflowCatalogSnapshot {
  const host = getPluginHostOptional();
  const manifests = host?.catalog?.plugins.map((plugin) => plugin.manifest) || [];
  return catalogSnapshotFromManifests(manifests);
}

export function hostPrimitiveCatalog(): WorkflowPrimitiveCatalog {
  const host = getPluginHostOptional();
  const manifests = host?.catalog?.plugins.map((plugin) => plugin.manifest) || [];
  return primitiveCatalogFromManifests(manifests);
}

export function splitContributionId(contributionId: string): { pluginId: string; localId: string } {
  const dot = contributionId.indexOf('.');
  if (dot <= 0) return { pluginId: contributionId, localId: contributionId };
  return { pluginId: contributionId.slice(0, dot), localId: contributionId.slice(dot + 1) };
}
