import {
  contributionKey,
  ipcRoute,
  mcpName,
  type CatalogIssue,
  type PluginManifest,
  type TodaySectionDescriptor,
  type TodaySectionSnapshot,
  type CaptureAdopter,
} from '@true-north/plugin-contract';
import type {
  AgentTool,
  PluginMainHandles,
  PluginPromptProvider,
  PluginRendererHandles,
  PluginResourceProvider,
  ShellSlotContribution,
  WorkbenchToolDefinition,
  WorkbenchViewContribution,
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
  ipc: Array<{ id: string; routePrefix: string; controller: object }>;
  captureAdopters: CaptureAdopter[];
  todaySections: Array<{ id: string; descriptor: TodaySectionDescriptor; collect: () => Promise<TodaySectionSnapshot> }>;
  tools: AgentTool[];
  resources: Array<{ localId: string; uriTemplate: string; provider: PluginResourceProvider }>;
  prompts: Array<{ localId: string; name: string; provider: PluginPromptProvider }>;
  skillRoots: Record<string, string>;
};

export function materializeMain(manifest: PluginManifest, handles: PluginMainHandles | undefined): MaterializedMain {
  const pluginId = manifest.pluginId;
  const issues: CatalogIssue[] = [];
  if (!handles) {
    const declared =
      manifest.contributions.ipc ||
      manifest.contributions.ai ||
      manifest.contributions.activity ||
      manifest.contributions.storage;
    return {
      issues: declared
        ? [{ code: 'reconcile', pluginId, message: `Plugin ${pluginId} has no main implementation` }]
        : [],
      ipc: [],
      captureAdopters: [],
      todaySections: [],
      tools: [],
      resources: [],
      prompts: [],
      skillRoots: {},
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

  const todaySections = Object.entries(manifest.contributions.activity?.today || {}).flatMap(([localId, descriptor]) => {
    const collect = handles.activity?.today?.[localId]?.collect;
    if (!collect) return [];
    const id = contributionKey(pluginId, localId);
    return [
      {
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
      },
    ];
  });

  return {
    issues,
    ipc: Object.entries(handles.ipc || {}).map(([localId, spec]) => ({
      id: `${pluginId}:${localId}`,
      routePrefix: ipcRoute(pluginId, localId),
      controller: spec.controller,
    })),
    captureAdopters: Object.entries(handles.activity?.capture || {}).map(([localId, spec]) => ({
      type: contributionKey(pluginId, localId),
      adopt: spec.adopt,
    })),
    todaySections,
    tools: Object.entries(handles.ai?.mcp?.tools || {}).map(([localId, tool]) => ({
      ...tool,
      name: mcpName(pluginId, localId),
      readOnly: tool.readOnly ?? manifest.contributions.ai?.mcp?.tools?.[localId]?.readOnly,
    })),
    resources: Object.entries(handles.ai?.mcp?.resources || {}).map(([localId, provider]) => ({
      localId,
      uriTemplate: manifest.contributions.ai?.mcp?.resources?.[localId]?.uriTemplate || '',
      provider,
    })),
    prompts: Object.entries(handles.ai?.mcp?.prompts || {}).map(([localId, provider]) => ({
      localId,
      name: mcpName(pluginId, localId),
      provider,
    })),
    skillRoots: handles.ai?.skillRoots || {},
  };
}

export type MaterializedRenderer = {
  issues: CatalogIssue[];
  views: WorkbenchViewContribution[];
  workspaces: WorkbenchToolDefinition[];
  actions: Array<{ id: string; run: (input: Record<string, unknown>) => Promise<void> }>;
  shellSlots: ShellSlotContribution[];
  openResource?: PluginRendererHandles['openResource'];
};

export function materializeRenderer(
  manifest: PluginManifest,
  handles: PluginRendererHandles | undefined,
): MaterializedRenderer {
  const pluginId = manifest.pluginId;
  if (!handles) {
    return {
      issues: [{ code: 'reconcile', pluginId, message: `Plugin ${pluginId} has no renderer implementation` }],
      views: [],
      workspaces: [],
      actions: [],
      shellSlots: [],
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

  return {
    issues,
    views: Object.entries(manifest.contributions.views || {}).flatMap(([localId, spec]) => {
      const load = handles.views?.[localId]?.load;
      if (!load) return [];
      return [
        {
          id: contributionKey(pluginId, localId),
          pluginId,
          nameKey: spec.nameKey,
          order: spec.order,
          default: spec.default,
          load,
        },
      ];
    }),
    workspaces: Object.entries(handles.workbench?.workspaces || {}).map(([localId, tool]) => ({
      ...tool,
      workspaceKey: contributionKey(pluginId, localId),
    })),
    actions: Object.entries(handles.workbench?.actions || {}).map(([localId, action]) => ({
      id: contributionKey(pluginId, localId),
      run: action.run,
    })),
    shellSlots: Object.entries(handles.shell?.slots || {}).map(([localId, slot]) => ({
      id: localId,
      pluginId,
      slot: manifest.contributions.shell?.slots?.[localId]?.slot || 'page-overlay',
      order: manifest.contributions.shell?.slots?.[localId]?.order,
      render: slot.render,
    })),
    openResource: handles.openResource,
  };
}

export function reconcileMain(manifest: PluginManifest, handles: PluginMainHandles | undefined): CatalogIssue[] {
  return materializeMain(manifest, handles).issues;
}

export function reconcileRenderer(manifest: PluginManifest, handles: PluginRendererHandles | undefined): CatalogIssue[] {
  return materializeRenderer(manifest, handles).issues;
}
