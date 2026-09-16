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
  pluginManifestSchema,
  definePluginManifest,
  parsePluginManifest,
  derivedContributionId,
  pluginResourceRefSchema,
  jsonSchemaObjectSchema,
  resourceRefSchema,
  workflowCommandContributionSchema,
  workflowEventContributionSchema,
  workflowInteractionContributionSchema,
  workflowContributionsSchema,
  commandResultSchema,
  CONFLICT_ACTIONS,
  validateManifests,
  activationOrder,
  disposeOrder,
} from '@true-north/plugin-contract';
export type {
  PluginApiVersion,
  ShellSlotId,
  PluginManifest,
  PluginSpace,
  PluginResourceRef,
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
  CatalogIssue,
} from '@true-north/plugin-contract';

export { assemblePluginCatalog, materializeMain, materializeRenderer, reconcileMain, reconcileRenderer } from './catalog.ts';
export type { PluginCatalog, AssembledPlugin, AssembleCatalogOptions } from './catalog.ts';
export type { MaterializedMain, MaterializedRenderer } from './materialize.ts';
export {
  defineExtensionPoint,
  ExtensionRegistry,
  valuesOf,
} from './extension-registry.ts';
export type {
  ExtensionPoint,
  ExtensionRegistration,
  ExtensionRecord,
} from './extension-registry.ts';
export {
  extensionPoints,
  createHostActionPort,
  openRegisteredResource,
  pluginCatalogEntry,
} from './extension-points.ts';
export type {
  IpcExtension,
  WorkflowCommandExtension,
  WorkflowInteractionExtension,
  McpResourceExtension,
  McpPromptExtension,
  SkillExtension,
  MentionExtension,
  WorkbenchActionExtension,
  PluginScopeExtension,
  ResourceOpenerExtension,
  PluginHubExtension,
  HostActionHandler,
} from './extension-points.ts';
export {
  localViewId,
  locationFromSearchParams,
  searchParamsFromLocation,
  hrefFromLocation,
  hrefFromSnapshot,
} from './view-adapter.ts';

export { defineMainImplementation, defineRendererImplementation } from './define.ts';
export type { TypedMainHandles } from './define.ts';

export { HostActionRegistry, HOST_AI_START, HOST_WORKFLOW_OPEN_PENDING } from './runtime.ts';
export { HOST_WORKBENCH_OPEN, HOST_BROWSER_OPEN } from './host-commands.ts';
export type {
  AiCachePort,
  AgentToolContext,
  AgentToolSpec,
  AgentTool,
  PluginResourceContent,
  PluginResourceListItem,
  PluginResourceProvider,
  PluginPromptProvider,
  WorkbenchHostActions,
  WorkbenchAdoptInput,
  WorkbenchToolProps,
  WorkbenchToolDefinition,
  WorkbenchExtractHandler,
  WorkbenchWorkspaceHost,
  PluginViewSnapshot,
  PluginViewOpenRequest,
  ViewStateCodec,
  PluginIcon,
  LocaleContribution,
  PluginIpcPort,
  HostActionPort,
  PluginAiStartInput,
  PluginMainContext,
  PluginMainHandles,
  PluginMainModule,
  PluginRendererContext,
  ShellSlotContribution,
  PluginRuntimeEntry,
  WorkbenchViewContribution,
  WorkbenchNewTabContribution,
  PluginHubProps,
  PluginRendererHandles,
  PluginRendererModule,
  PluginDescriptor,
  PluginWorkflowPort,
  PluginRendererWorkflowPort,
  WorkflowCommandHandler,
  WorkflowInteractionProps,
} from './runtime.ts';

export { AiPlatformError, parseAiError, toIpcError } from './ai-error.ts';
export { prefixPluginIpc } from './ipc-prefix.ts';
export { nextRevision, revisionOf } from './revision.ts';
export { workspaceAdoptKey } from './workspace-adopt-key.ts';
