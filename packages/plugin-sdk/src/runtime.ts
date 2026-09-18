import type { ComponentType, ReactNode } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import type {
  CommandResult,
  PluginManifest,
  PluginSpace,
  ResourceRef,
  ShellSlotId,
  WorkflowCommandContext,
} from '@true-north/plugin-contract';

export type AiCachePort = {
  fingerprintPromptContext(promptContext: string): string;
  findMatching<T extends { runId: string; analysisSummary: string; suggestions: unknown[] }>(input: {
    capabilityKey: string;
    refType: string;
    refId: string;
    contextFingerprint: string;
  }): Promise<T | null>;
  upsert(input: {
    capabilityKey: string;
    refType: string;
    refId: string;
    contextFingerprint: string;
    response: { runId: string; analysisSummary: string; suggestions: unknown[] };
  }): Promise<void>;
};

export type AgentToolContext = {
  appendWorkspace: (part: unknown) => string;
  conflictTicketId?: string;
};

export type AgentToolSpec = {
  description: string;
  parameters: Record<string, unknown>;
  schema: { parse(value: unknown): unknown };
  readOnly?: boolean;
  execute: (args: Record<string, unknown>, ctx: AgentToolContext) => Promise<string>;
};

export type AgentTool = AgentToolSpec & { name: string };

export type PluginResourceContent = {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
};

export type PluginResourceListItem = {
  uri: string;
  name?: string;
  mimeType?: string;
};

export type PluginResourceProvider = {
  list(): Promise<PluginResourceListItem[]>;
  read(uri: string): Promise<PluginResourceContent | null>;
  search?(query: string): Promise<PluginResourceListItem[]>;
};

export type PluginPromptProvider = {
  description?: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
  get(args: Record<string, string>): Promise<{ messages: Array<{ role: string; content: { type: 'text'; text: string } }> }>;
};

export type WorkbenchAdoptInput = {
  pluginId: string;
  localId: string;
  input?: unknown;
};

export type WorkbenchHostActions = {
  updatePayload: (payload: Record<string, unknown>) => Promise<boolean>;
  requestFollowUp: (text: string) => void;
  adopt: (input: WorkbenchAdoptInput) => Promise<CommandResult>;
};

export type WorkbenchToolProps<TPayload = Record<string, unknown>> = {
  payload: TPayload;
  messageId: string;
  workspaceId?: string;
  conversationId: string;
  actions: WorkbenchHostActions;
};

export type WorkbenchToolDefinition<TPayload = Record<string, unknown>> = {
  workspaceKey?: string;
  title: (payload: TPayload) => string;
  entryLabel: (payload: TPayload) => string;
  autoOpen?: (input: { payload: TPayload; message: { parts: Array<Record<string, unknown>> } | unknown; force: boolean }) => boolean;
  parsePayload: (payload: Record<string, unknown>) => TPayload;
  Component: ComponentType<WorkbenchToolProps<TPayload>>;
};

export type WorkbenchExtractHandler = (input: {
  result: unknown;
  url: string;
}) => Promise<void>;

export type WorkbenchWorkspaceHost = {
  load(
    conversationId: string,
    messageId: string,
    workspaceId: string,
  ): Promise<{ workspaceKey: string; payload: Record<string, unknown>; workspaceId: string }>;
  subscribe(
    messageId: string,
    workspaceId: string,
    onUpdate: (next: { workspaceKey: string; payload: Record<string, unknown>; workspaceId: string }) => void,
  ): () => void;
  patch(
    messageId: string,
    workspaceId: string,
    payload: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
};

export type PluginViewSnapshot = {
  viewId: string;
  params: Record<string, string>;
};

/** Hub 定位：点资源打开插件页，不是可挂载 view。 */
export type ResourceOpenRequest = {
  pluginId: string;
  location: Record<string, string>;
};

export type ViewStateCodec<T> = {
  decode(params: Record<string, string>): T;
  encode(state: T): Record<string, string>;
};

export type PluginIcon = ComponentType<{
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
}>;

export type LocaleContribution = {
  pluginId: string;
  messages: Record<string, Record<string, string>>;
};

export type PluginIpcPort = {
  get<T = unknown>(path: string, payload?: unknown): Promise<T>;
  post<T = unknown>(path: string, payload?: unknown): Promise<T>;
  put<T = unknown>(path: string, payload?: unknown): Promise<T>;
  remove<T = unknown>(path: string, payload?: unknown): Promise<T>;
};

export type HostActionPort = {
  invoke(id: string, input?: unknown): Promise<void>;
  register(id: string, handler: (input?: unknown) => void | Promise<void>): () => void;
};

export class HostActionRegistry implements HostActionPort {
  private readonly handlers = new Map<string, (input?: unknown) => void | Promise<void>>();

  register(id: string, handler: (input?: unknown) => void | Promise<void>) {
    this.handlers.set(id, handler);
    return () => {
      if (this.handlers.get(id) === handler) this.handlers.delete(id);
    };
  }

  async invoke(id: string, input?: unknown) {
    const handler = this.handlers.get(id);
    if (!handler) throw new Error(`Unknown host action: ${id}`);
    await handler(input);
  }
}

export type PluginAiStartInput = {
  uri?: string;
  label?: string;
  skill?: string;
  message?: string;
  /** 复用已有资源会话时预填的固定开场。 */
  kickoff?: string;
  resourceLinks?: Array<{ uri: string; label: string }>;
};

export type PluginWorkflowPort = {
  emit(
    localId: string,
    payload?: Record<string, unknown>,
    source?: ResourceRef,
    options?: { eventId?: string },
  ): Promise<void>;
};

export type WorkflowCommandHandler = {
  execute(input: unknown, ctx: WorkflowCommandContext): Promise<CommandResult>;
};

export type PluginRendererWorkflowPort = {
  runCommand(
    localId: string,
    input: unknown,
    options?: { idempotencyKey?: string; planId?: string; nodeId?: string },
  ): Promise<CommandResult>;
  openInteraction(localId: string, draft?: Record<string, unknown>): Promise<Record<string, unknown> | null>;
};

export type WorkflowInteractionProps = {
  draft?: Record<string, unknown>;
  onSubmit: (input: Record<string, unknown>) => Promise<void>;
  onCancel: () => Promise<void>;
};

export type PluginNotifyInput = {
  title: string;
  body?: string;
  href?: string;
  uri?: string;
  dedupeKey?: string;
  /** upsert 更新已有行（含已读）；remind 有未读则跳过，否则新建未读 */
  mode?: 'upsert' | 'remind';
};

export type PluginNotifyPort = {
  post(input: PluginNotifyInput): Promise<void>;
  dismiss(dedupeKey: string): Promise<void>;
};

export type PluginMainContext = {
  pluginId: string;
  space: PluginSpace;
  workflow: PluginWorkflowPort;
  cache: AiCachePort;
  notify: PluginNotifyPort;
};

export type PluginMainHandles = {
  ipc?: Record<string, { controller: object }>;
  workflow?: {
    commands?: Record<string, WorkflowCommandHandler>;
  };
  resources?: Record<string, PluginResourceProvider>;
  ai?: {
    mcp?: {
      tools?: Record<string, AgentToolSpec>;
      prompts?: Record<string, PluginPromptProvider>;
    };
    skillRoots?: Record<string, string>;
  };
};

export type PluginMainModule = {
  activate(ctx: PluginMainContext): Promise<PluginMainHandles> | PluginMainHandles;
  dispose?(): void | Promise<void>;
};

export type PluginRendererContext = {
  pluginId: string;
  locale: { lang: string; t: (key: string) => string };
  ipc: PluginIpcPort;
  navigate: NavigateFunction;
  hostActions: HostActionPort;
  workflow: PluginRendererWorkflowPort;
  product?: {
    Surface: ComponentType<{ id: string; children?: ReactNode }>;
    ref: (id: string) => string;
  };
};

export type ShellSlotContribution = {
  slot: ShellSlotId;
  pluginId: string;
  id: string;
  order?: number;
  render: ComponentType<{ children?: ReactNode }>;
};

export type PluginRuntimeEntry = {
  pluginId: string;
  nameKey: string;
  path: string;
  order?: number;
  icon?: PluginIcon;
  descriptionKey?: string;
  categoryKey?: string;
  keywords?: string[];
};

export type WorkbenchNewTabContribution = {
  id: string;
  pluginId: string;
  nameKey: string;
  order?: number;
  load: () => Promise<{ default: ComponentType }>;
};

export type PluginHubProps = {
  location: Record<string, string>;
  navigate: (next: Record<string, string>) => void;
};

export type PluginRendererHandles = {
  icon?: PluginIcon;
  locales?: LocaleContribution[];
  scope?: ComponentType<{ children?: ReactNode }>;
  hub?: {
    load: () => Promise<{ default: ComponentType<PluginHubProps> }>;
  };
  workflow?: {
    interactions?: Record<string, { load: () => Promise<{ default: ComponentType<WorkflowInteractionProps> }> }>;
  };
  workbench?: {
    workspaces?: Record<string, WorkbenchToolDefinition>;
    actions?: Record<string, { run: (input: Record<string, unknown>) => Promise<void> }>;
    newTabs?: Record<string, { load: () => Promise<{ default: ComponentType }> }>;
  };
  shell?: {
    slots?: Record<string, { render: ComponentType<{ children?: ReactNode }> }>;
  };
  openResource?: (uri: string) => ResourceOpenRequest | null;
};

export type PluginRendererModule = {
  activate(ctx: PluginRendererContext): PluginRendererHandles;
};

export type PluginDescriptor = {
  manifest: PluginManifest;
  loadMain?: () => Promise<{ createMain: () => PluginMainModule | Promise<PluginMainModule> } | PluginMainModule>;
  loadRenderer?: () => Promise<{ createRenderer: () => PluginRendererModule } | PluginRendererModule>;
};

export const HOST_AI_START = 'host.ai.start';
export const HOST_WORKFLOW_OPEN_PENDING = 'host.workflow.openPending';
export const HOST_NOTIFICATION_INVALIDATE_EVENT = 'host.notification.invalidate';
