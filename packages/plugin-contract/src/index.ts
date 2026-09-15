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
export type { PluginManifest } from './manifest.ts';

export { hostStorageCapabilitySchema } from './storage.ts';
export type { HostStorageCapability, PluginSpace } from './storage.ts';

export {
  captureSuggestionSchema,
  capturePayloadSchema,
  adoptCaptureRequestSchema,
  normalizeCaptureSuggestion,
} from './capture.ts';
export type {
  CaptureSuggestion,
  CapturePayload,
  AdoptCaptureRequest,
  CaptureAdopter,
  CaptureAdoptedLink,
  CaptureSuggestionStatus,
} from './capture.ts';

export {
  activityEntityRefSchema,
  ACTIVITY_RECORD_EVENT,
  ACTIVITY_UNLINK_EVENT,
  ACTIVITY_TODAY_INVALIDATE_EVENT,
} from './activity.ts';
export type { ActivityEntityRef, ActivityLinkRef, CreateActivityInput, ActivityPort } from './activity.ts';

export { pluginResourceRefSchema } from './resource.ts';
export type { PluginResourceRef } from './resource.ts';

export {
  todaySectionKindSchema,
  todaySectionDescriptorSchema,
  todaySectionSnapshotSchema,
  mergeTodaySections,
} from './today.ts';
export type {
  TodaySectionKind,
  TodaySectionDescriptor,
  TodaySectionSnapshot,
  TodaySectionValues,
  TodayListItem,
  TodayListItemAction,
  TodayCommand,
} from './today.ts';

export { validateManifests, activationOrder, disposeOrder } from './validate.ts';
export type { CatalogIssue } from './validate.ts';
