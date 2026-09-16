/**
 * `@true-north/plugin-contract` 是插件清单的可序列化契约（API 0）。
 * 字段含义写在各 schema / 类型的注释里；实现与 React 组件属于 `@true-north/plugin-sdk`。
 */
export {
  PLUGIN_API_VERSION,
  PLUGIN_HUB_PATH,
  namespacedId,
  pluginPath,
  contributionKey,
  ipcRoute,
  mcpName,
  pluginResourceUri,
  parsePluginResourceUri,
  SHELL_SLOT_IDS,
} from './ids.ts';
export type { PluginApiVersion, ShellSlotId } from './ids.ts';

export {
  pluginManifestSchema,
  definePluginManifest,
  parsePluginManifest,
  pluginContributionsSchema,
  derivedContributionId,
} from './manifest.ts';
export type {
  PluginManifest,
  PluginManifestInput,
  PluginContributions,
  PluginCatalogMeta,
  DeclaredContribution,
  ViewContribution,
  NewTabContribution,
  ShellSlotContribution,
  SkillContribution,
  McpToolContribution,
  McpResourceContribution,
  McpResourceMention,
} from './manifest.ts';

export type { PluginSpace } from './storage.ts';

export { pluginResourceRefSchema } from './resource.ts';
export type { PluginResourceRef } from './resource.ts';

export {
  jsonSchemaObjectSchema,
  resourceRefSchema,
  workflowCommandContributionSchema,
  workflowEventContributionSchema,
  workflowInteractionContributionSchema,
  workflowContributionsSchema,
  commandResultSchema,
  CONFLICT_ACTIONS,
} from './workflow.ts';
export type {
  JsonSchemaObject,
  ResourceRef,
  WorkflowCommandContribution,
  WorkflowEventContribution,
  WorkflowInteractionContribution,
  WorkflowContributions,
  EmittedEvent,
  CommandResult,
  WorkflowCommandContext,
  DomainEvent,
  ConflictAction,
} from './workflow.ts';

export { validateManifests, activationOrder, disposeOrder } from './validate.ts';
export type { CatalogIssue } from './validate.ts';
