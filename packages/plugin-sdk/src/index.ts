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
  captureSuggestionSchema,
  capturePayloadSchema,
  adoptCaptureRequestSchema,
  normalizeCaptureSuggestion,
  activityEntityRefSchema,
  ACTIVITY_RECORD_EVENT,
  ACTIVITY_UNLINK_EVENT,
  ACTIVITY_TODAY_INVALIDATE_EVENT,
  pluginResourceRefSchema,
  todaySectionKindSchema,
  todaySectionDescriptorSchema,
  todaySectionSnapshotSchema,
  mergeTodaySections,
  validateManifests,
  activationOrder,
  disposeOrder,
} from '@true-north/plugin-contract';
export type {
  PluginApiVersion,
  ShellSlotId,
  PluginManifest,
  PluginSpace,
  CaptureSuggestion,
  CapturePayload,
  AdoptCaptureRequest,
  CaptureAdopter,
  CaptureAdoptedLink,
  CaptureSuggestionStatus,
  ActivityEntityRef,
  ActivityLinkRef,
  CreateActivityInput,
  ActivityPort,
  PluginResourceRef,
  TodaySectionKind,
  TodaySectionDescriptor,
  TodaySectionSnapshot,
  TodaySectionValues,
  TodayListItem,
  TodayListItemAction,
  TodayCommand,
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
  TodayExtension,
  McpResourceExtension,
  McpPromptExtension,
  SkillExtension,
  MentionExtension,
  WorkbenchActionExtension,
  PluginScopeExtension,
  ResourceOpenerExtension,
  PluginPageShellExtension,
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

export { HostActionRegistry, HOST_AI_START } from './runtime.ts';
export { HOST_WORKBENCH_OPEN, HOST_BROWSER_OPEN } from './host-commands.ts';
export type {
  AiCachePort,
  AgentToolSpec,
  AgentTool,
  PluginResourceContent,
  PluginResourceListItem,
  PluginResourceProvider,
  PluginPromptProvider,
  WorkbenchHostActions,
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
  PluginPageProps,
  PluginPageShellProps,
  PluginRendererHandles,
  PluginRendererModule,
  PluginDescriptor,
} from './runtime.ts';

export { AiPlatformError, parseAiError, toIpcError } from './ai-error.ts';
export { prefixPluginIpc } from './ipc-prefix.ts';
