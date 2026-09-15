import type { ComponentType, ReactNode } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import type {
  ActivityPort,
  CaptureAdopter,
  PluginManifest,
  PluginSpace,
  ShellSlotId,
  TodaySectionValues,
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

export type AgentToolSpec = {
  description: string;
  parameters: Record<string, unknown>;
  schema: { parse(value: unknown): unknown };
  readOnly?: boolean;
  execute: (args: Record<string, unknown>, ctx: { appendWorkspace: (part: unknown) => void }) => Promise<string>;
};

export type AgentTool = AgentToolSpec & { name: string };

export type PluginResourceContent = {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
};

export type PluginResourceProvider = {
  list(): Promise<Array<{ uri: string; name?: string; mimeType?: string }>>;
  read(uri: string): Promise<PluginResourceContent | null>;
};

export type PluginPromptProvider = {
  description?: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
  get(args: Record<string, string>): Promise<{ messages: Array<{ role: string; content: { type: 'text'; text: string } }> }>;
};

export type WorkbenchHostActions = {
  updatePayload: (payload: Record<string, unknown>) => Promise<boolean>;
  requestFollowUp: (text: string) => void;
};

export type WorkbenchToolProps<TPayload = Record<string, unknown>> = {
  payload: TPayload;
  messageId: string;
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
  load(conversationId: string, messageId: string): Promise<{ workspaceKey: string; payload: Record<string, unknown> }>;
  subscribe(
    messageId: string,
    onUpdate: (next: { workspaceKey: string; payload: Record<string, unknown> }) => void,
  ): () => void;
  patch(messageId: string, payload: Record<string, unknown>): Promise<Record<string, unknown>>;
};

export type PluginViewSnapshot = {
  viewId: string;
  params: Record<string, string>;
};

export type PluginViewOpenRequest = PluginViewSnapshot;

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
  invoke(id: string, input?: unknown): Promise<void> | void;
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
};

export type PluginMainContext = {
  pluginId: string;
  space: PluginSpace;
  activity: ActivityPort;
  cache: AiCachePort;
};

export type PluginMainHandles = {
  ipc?: Record<string, { controller: object }>;
  activity?: {
    capture?: Record<string, { adopt: CaptureAdopter['adopt'] }>;
    today?: Record<string, { collect(): Promise<TodaySectionValues> }>;
  };
  ai?: {
    mcp?: {
      tools?: Record<string, AgentToolSpec>;
      resources?: Record<string, PluginResourceProvider>;
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

export type WorkbenchViewContribution = {
  id: string;
  pluginId: string;
  nameKey: string;
  order?: number;
  default?: boolean;
  load: () => Promise<{ default: ComponentType }>;
};

export type PluginRendererHandles = {
  icon?: PluginIcon;
  locales?: LocaleContribution[];
  scope?: ComponentType<{ children?: ReactNode }>;
  views?: Record<string, { load: () => Promise<{ default: ComponentType }> }>;
  workbench?: {
    workspaces?: Record<string, WorkbenchToolDefinition>;
    actions?: Record<string, { run: (input: Record<string, unknown>) => Promise<void> }>;
  };
  shell?: {
    slots?: Record<string, { render: ComponentType<{ children?: ReactNode }> }>;
  };
  openResource?: (uri: string) => PluginViewOpenRequest | null;
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
