import {
  contributionKey,
  ipcRoute,
  mcpName,
  type CatalogIssue,
  type PluginManifest,
  type TodaySectionSnapshot,
} from '@true-north/plugin-contract';
import { extensionPoints, pluginCatalogEntry, type TodayExtension } from './extension-points.ts';
import type { ExtensionRegistration } from './extension-registry.ts';
import type {
  PluginMainHandles,
  PluginRendererHandles,
} from './runtime.ts';

function asSet(values: Array<string | undefined>): Set<string> {
  return new Set(values.filter((value): value is string => Boolean(value)));
}

function equalSets(expected: Set<string>, actual: Set<string>, pluginId: string, label: string): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  for (const key of expected) {
    if (!actual.has(key)) {
      issues.push({
        code: 'reconcile',
        pluginId,
        message: `Plugin ${pluginId} declared ${label} "${key}" but did not implement it`,
      });
    }
  }
  for (const key of actual) {
    if (!expected.has(key)) {
      issues.push({
        code: 'reconcile',
        pluginId,
        message: `Plugin ${pluginId} implemented undeclared ${label} "${key}"`,
      });
    }
  }
  return issues;
}

export type MaterializedMain = {
  issues: CatalogIssue[];
  registrations: ExtensionRegistration[];
};

export function materializeMain(manifest: PluginManifest, handles: PluginMainHandles | undefined): MaterializedMain {
  const pluginId = manifest.pluginId;
  const issues: CatalogIssue[] = [];
  if (!handles) {
    const declared =
      manifest.contributions.ipc || manifest.contributions.ai || manifest.contributions.activity;
    return {
      issues: declared
        ? [{ code: 'reconcile', pluginId, message: `Plugin ${pluginId} has no main implementation` }]
        : [],
      registrations: [],
    };
  }

  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.ipc || {})),
      asSet(Object.keys(handles.ipc || {})),
      pluginId,
      'ipc controller',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.activity?.captureTypes || {})),
      asSet(Object.keys(handles.activity?.capture || {})),
      pluginId,
      'capture type',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.activity?.today || {})),
      asSet(Object.keys(handles.activity?.today || {})),
      pluginId,
      'today section',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.ai?.mcp?.tools || {})),
      asSet(Object.keys(handles.ai?.mcp?.tools || {})),
      pluginId,
      'mcp tool',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.ai?.mcp?.resources || {})),
      asSet(Object.keys(handles.ai?.mcp?.resources || {})),
      pluginId,
      'mcp resource',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.ai?.mcp?.prompts || {})),
      asSet(Object.keys(handles.ai?.mcp?.prompts || {})),
      pluginId,
      'mcp prompt',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.ai?.skills || {})),
      asSet(Object.keys(handles.ai?.skillRoots || {})),
      pluginId,
      'skill',
    ),
  );

  const registrations: ExtensionRegistration[] = [];

  for (const [localId, spec] of Object.entries(handles.ipc || {})) {
    registrations.push({
      point: extensionPoints.ipc,
      key: `${pluginId}:${localId}`,
      value: {
        id: `${pluginId}:${localId}`,
        routePrefix: ipcRoute(pluginId, localId),
        controller: spec.controller,
      },
    });
  }

  for (const [localId, spec] of Object.entries(handles.activity?.capture || {})) {
    registrations.push({
      point: extensionPoints.capture,
      key: contributionKey(pluginId, localId),
      value: {
        type: contributionKey(pluginId, localId),
        adopt: spec.adopt,
      },
    });
  }

  for (const [localId, descriptor] of Object.entries(manifest.contributions.activity?.today || {})) {
    const collect = handles.activity?.today?.[localId]?.collect;
    if (!collect) continue;
    const id = contributionKey(pluginId, localId);
    const today: TodayExtension = {
      id,
      descriptor,
      collect: async (): Promise<TodaySectionSnapshot> => {
        const values = await collect();
        return {
          id,
          kind: descriptor.kind,
          titleKey: descriptor.titleKey,
          order: descriptor.order,
          unit: descriptor.unit,
          value: values.value,
          items: values.items,
          timer: values.timer,
        };
      },
    };
    registrations.push({
      point: extensionPoints.today,
      key: id,
      order: descriptor.order,
      value: today,
    });
  }

  for (const [localId, tool] of Object.entries(handles.ai?.mcp?.tools || {})) {
    const name = mcpName(pluginId, localId);
    registrations.push({
      point: extensionPoints.mcpTool,
      key: name,
      value: {
        ...tool,
        name,
        readOnly: tool.readOnly ?? manifest.contributions.ai?.mcp?.tools?.[localId]?.readOnly,
      },
    });
  }

  for (const [localId, provider] of Object.entries(handles.ai?.mcp?.resources || {})) {
    const resource = manifest.contributions.ai?.mcp?.resources?.[localId];
    const key = contributionKey(pluginId, localId);
    registrations.push({
      point: extensionPoints.mcpResource,
      key,
      value: {
        pluginId,
        localId,
        uriTemplate: resource?.uriTemplate || '',
        provider,
      },
    });
    if (resource?.mention) {
      registrations.push({
        point: extensionPoints.mention,
        key,
        order: resource.mention.order,
        value: {
          pluginId,
          localId,
          labelKey: resource.mention.labelKey,
          provider,
        },
      });
    }
  }

  for (const [localId, provider] of Object.entries(handles.ai?.mcp?.prompts || {})) {
    const name = mcpName(pluginId, localId);
    registrations.push({
      point: extensionPoints.mcpPrompt,
      key: name,
      value: {
        pluginId,
        localId,
        name,
        provider,
      },
    });
  }

  for (const [localId, root] of Object.entries(handles.ai?.skillRoots || {})) {
    registrations.push({
      point: extensionPoints.skill,
      key: contributionKey(pluginId, localId),
      value: {
        pluginId,
        localId,
        root,
      },
    });
  }

  return { issues, registrations };
}

export type MaterializedRenderer = {
  issues: CatalogIssue[];
  registrations: ExtensionRegistration[];
};

export function materializeRenderer(
  manifest: PluginManifest,
  handles: PluginRendererHandles | undefined,
): MaterializedRenderer {
  const pluginId = manifest.pluginId;
  if (!handles) {
    return {
      issues: [{ code: 'reconcile', pluginId, message: `Plugin ${pluginId} has no renderer implementation` }],
      registrations: [],
    };
  }
  const issues: CatalogIssue[] = [];
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.views || {})),
      asSet(Object.keys(handles.views || {})),
      pluginId,
      'view',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.workbench?.workspaces || {})),
      asSet(Object.keys(handles.workbench?.workspaces || {})),
      pluginId,
      'workspace',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.workbench?.actions || {})),
      asSet(Object.keys(handles.workbench?.actions || {})),
      pluginId,
      'workbench action',
    ),
  );
  issues.push(
    ...equalSets(
      asSet(Object.keys(manifest.contributions.shell?.slots || {})),
      asSet(Object.keys(handles.shell?.slots || {})),
      pluginId,
      'shell slot',
    ),
  );
  if (manifest.contributions.page && !handles.page?.load) {
    issues.push({
      code: 'reconcile',
      pluginId,
      message: `Plugin ${pluginId} declared page but did not implement it`,
    });
  }
  if (!manifest.contributions.page && handles.page?.load) {
    issues.push({
      code: 'reconcile',
      pluginId,
      message: `Plugin ${pluginId} implemented undeclared page`,
    });
  }

  const registrations: ExtensionRegistration[] = [
    {
      point: extensionPoints.plugin,
      key: pluginId,
      order: manifest.catalog.order,
      value: pluginCatalogEntry(manifest, handles.icon),
    },
  ];

  for (const [localId, spec] of Object.entries(manifest.contributions.views || {})) {
    const load = handles.views?.[localId]?.load;
    if (!load) continue;
    registrations.push({
      point: extensionPoints.view,
      key: contributionKey(pluginId, localId),
      order: spec.order,
      value: {
        id: contributionKey(pluginId, localId),
        pluginId,
        nameKey: spec.nameKey,
        order: spec.order,
        load,
      },
    });
  }

  for (const [localId, tool] of Object.entries(handles.workbench?.workspaces || {})) {
    registrations.push({
      point: extensionPoints.workspace,
      key: contributionKey(pluginId, localId),
      value: {
        ...tool,
        workspaceKey: contributionKey(pluginId, localId),
      },
    });
  }

  for (const [localId, action] of Object.entries(handles.workbench?.actions || {})) {
    registrations.push({
      point: extensionPoints.workbenchAction,
      key: contributionKey(pluginId, localId),
      value: {
        id: contributionKey(pluginId, localId),
        run: action.run,
      },
    });
  }

  for (const [localId, slot] of Object.entries(handles.shell?.slots || {})) {
    registrations.push({
      point: extensionPoints.shellSlot,
      key: `${pluginId}:${localId}`,
      order: manifest.contributions.shell?.slots?.[localId]?.order,
      value: {
        id: localId,
        pluginId,
        slot: manifest.contributions.shell?.slots?.[localId]?.slot || 'page-overlay',
        order: manifest.contributions.shell?.slots?.[localId]?.order,
        render: slot.render,
      },
    });
  }

  for (const locale of handles.locales || []) {
    registrations.push({
      point: extensionPoints.locale,
      key: locale.pluginId || pluginId,
      value: locale,
    });
  }

  if (handles.scope) {
    registrations.push({
      point: extensionPoints.scope,
      key: pluginId,
      value: { pluginId, Component: handles.scope },
    });
  }

  if (handles.openResource) {
    const open = handles.openResource;
    registrations.push({
      point: extensionPoints.resourceOpener,
      key: pluginId,
      value: { open },
    });
  }

  if (handles.page?.load) {
    registrations.push({
      point: extensionPoints.pageShell,
      key: pluginId,
      value: {
        pluginId,
        load: handles.page.load,
      },
    });
  }

  return { issues, registrations };
}

export function reconcileMain(manifest: PluginManifest, handles: PluginMainHandles | undefined): CatalogIssue[] {
  return materializeMain(manifest, handles).issues;
}

export function reconcileRenderer(manifest: PluginManifest, handles: PluginRendererHandles | undefined): CatalogIssue[] {
  return materializeRenderer(manifest, handles).issues;
}
