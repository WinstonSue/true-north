import type { ComponentType, ReactNode } from 'react';
import {
  contributionKey,
  ipcRoute,
  mcpName,
  pluginPath,
  type CommandResult,
  type PluginManifest,
  type WorkflowCommandContext,
} from '@true-north/plugin-contract';
import { defineExtensionPoint, type ExtensionRegistry } from './extension-registry.ts';
import type {
  AgentTool,
  HostActionPort,
  LocaleContribution,
  PluginHubProps,
  PluginIcon,
  PluginPromptProvider,
  PluginResourceProvider,
  PluginRuntimeEntry,
  PluginViewOpenRequest,
  ShellSlotContribution,
  WorkbenchToolDefinition,
  WorkbenchViewContribution,
  WorkbenchNewTabContribution,
  WorkflowInteractionProps,
} from './runtime.ts';

export type IpcExtension = {
  id: string;
  routePrefix: string;
  controller: object;
};

export type WorkflowCommandExtension = {
  pluginId: string;
  localId: string;
  id: string;
  execute: (input: unknown, ctx: WorkflowCommandContext) => Promise<CommandResult>;
};

export type WorkflowInteractionExtension = {
  pluginId: string;
  localId: string;
  id: string;
  producesCommand: string;
  load: () => Promise<{ default: ComponentType<WorkflowInteractionProps> }>;
};

export type McpResourceExtension = {
  pluginId: string;
  localId: string;
  uriTemplate: string;
  provider: PluginResourceProvider;
};

export type McpPromptExtension = {
  pluginId: string;
  localId: string;
  name: string;
  provider: PluginPromptProvider;
};

export type SkillExtension = {
  pluginId: string;
  localId: string;
  root: string;
};

export type MentionExtension = {
  pluginId: string;
  localId: string;
  labelKey: string;
  provider: PluginResourceProvider;
};

export type WorkbenchActionExtension = {
  id: string;
  run: (input: Record<string, unknown>) => Promise<void>;
};

export type PluginScopeExtension = {
  pluginId: string;
  Component: ComponentType<{ children?: ReactNode }>;
};

export type ResourceOpenerExtension = {
  open: (uri: string) => PluginViewOpenRequest | null;
};

export type PluginHubExtension = {
  pluginId: string;
  load: () => Promise<{ default: ComponentType<PluginHubProps> }>;
};

export type HostActionHandler = (input?: unknown) => void | Promise<void>;

export const extensionPoints = {
  ipc: defineExtensionPoint<IpcExtension>('ipc'),
  workflowCommand: defineExtensionPoint<WorkflowCommandExtension>('workflow.command'),
  workflowInteraction: defineExtensionPoint<WorkflowInteractionExtension>('workflow.interaction'),
  mcpTool: defineExtensionPoint<AgentTool>('ai.mcp.tool'),
  mcpResource: defineExtensionPoint<McpResourceExtension>('ai.mcp.resource'),
  mcpPrompt: defineExtensionPoint<McpPromptExtension>('ai.mcp.prompt'),
  skill: defineExtensionPoint<SkillExtension>('ai.skill'),
  agentInstruction: defineExtensionPoint<string>('ai.instruction'),
  mention: defineExtensionPoint<MentionExtension>('ai.composer.mention'),
  plugin: defineExtensionPoint<PluginRuntimeEntry>('renderer.plugin'),
  view: defineExtensionPoint<WorkbenchViewContribution>('renderer.view'),
  newTab: defineExtensionPoint<WorkbenchNewTabContribution>('renderer.newTab'),
  workspace: defineExtensionPoint<WorkbenchToolDefinition>('renderer.workspace'),
  workbenchAction: defineExtensionPoint<WorkbenchActionExtension>('renderer.action'),
  shellSlot: defineExtensionPoint<ShellSlotContribution>('renderer.shell'),
  locale: defineExtensionPoint<LocaleContribution>('renderer.locale'),
  scope: defineExtensionPoint<PluginScopeExtension>('renderer.scope'),
  resourceOpener: defineExtensionPoint<ResourceOpenerExtension>('renderer.resourceOpener'),
  hub: defineExtensionPoint<PluginHubExtension>('renderer.hub'),
  hostAction: defineExtensionPoint<HostActionHandler>('renderer.hostAction'),
} as const;

export function createHostActionPort(registry: ExtensionRegistry, owner = 'runtime'): HostActionPort {
  return {
    register(id, handler) {
      return registry.register(owner, extensionPoints.hostAction, id, handler);
    },
    async invoke(id, input) {
      const handler = registry.get(extensionPoints.hostAction, id);
      if (!handler) throw new Error(`Unknown host action: ${id}`);
      await handler(input);
    },
  };
}

export function openRegisteredResource(registry: ExtensionRegistry, uri: string): PluginViewOpenRequest | null {
  for (const opener of registry.list(extensionPoints.resourceOpener)) {
    const request = opener.open(uri);
    if (request) return request;
  }
  return null;
}

export function pluginCatalogEntry(
  manifest: PluginManifest,
  icon?: PluginIcon,
): PluginRuntimeEntry {
  return {
    pluginId: manifest.pluginId,
    nameKey: manifest.catalog.nameKey,
    path: pluginPath(manifest.pluginId),
    order: manifest.catalog.order,
    icon,
    descriptionKey: manifest.catalog.descriptionKey,
    categoryKey: manifest.catalog.categoryKey,
    keywords: manifest.catalog.keywords,
  };
}

export { contributionKey, ipcRoute, mcpName };
