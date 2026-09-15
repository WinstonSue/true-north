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
  ShellSlotContribution,
  SkillContribution,
  McpToolContribution,
  McpResourceContribution,
  McpResourceMention,
} from './manifest.ts';

export type { PluginSpace } from './storage.ts';

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
