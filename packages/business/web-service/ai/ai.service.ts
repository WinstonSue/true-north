import type {
  AiChatStreamEventVo,
  CancelStreamResponseVo,
  ConversationVo,
  CreateConversationRequestVo,
  EnsureResourceConversationRequestVo,
  EnsureResourceConversationResponseVo,
  AiResourceMentionVo,
  MessageVo,
  PatchConversationRuntimeRequestVo,
  PatchWorkspaceRequestVo,
  PinConversationRequestVo,
  PutRuntimeSelectionRequestVo,
  PutRuntimeSettingsRequestVo,
  RenameConversationRequestVo,
  RuntimeAgentVo,
  RuntimeSelectionVo,
  RuntimeSettingsVo,
  StartMessageStreamRequestVo,
  StartMessageStreamResponseVo,
} from '@true-north/vo';
import { AI_CONVERSATION_STREAM_CHANNEL } from '@true-north/vo';
import AiController from '../controller/ai';
import { aiErrorUserMessage, parseAiError } from './parse-ai-error';

export type AiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: ReturnType<typeof parseAiError>['code']; message: string };

async function wrap<T>(fn: () => Promise<T>): Promise<AiResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error: unknown) {
    const parsed = parseAiError(error);
    return {
      ok: false,
      code: parsed.code,
      message: aiErrorUserMessage(parsed.code, parsed.message),
    };
  }
}

type StreamHandler = (event: AiChatStreamEventVo) => void;

const streamListeners = new Set<StreamHandler>();
let bridgeAttached = false;
let bridgeListener: ((...args: any[]) => void) | null = null;

function readIpcPayload<T>(...args: unknown[]): T | undefined {
  if (args.length >= 2) return args[1] as T;
  if (args.length === 1) return args[0] as T;
  return undefined;
}

function ensureStreamBridge() {
  if (bridgeAttached) return;
  const api = typeof window !== 'undefined' ? window.electronAPI : undefined;
  if (!api?.on) return;
  bridgeListener = (...args: unknown[]) => {
    const payload = readIpcPayload<AiChatStreamEventVo>(...args);
    if (!payload || typeof payload !== 'object' || !('event' in payload) || !('streamId' in payload)) {
      return;
    }
    for (const handler of streamListeners) {
      try {
        handler(payload);
      } catch {
        // ignore handler errors
      }
    }
  };
  api.on(AI_CONVERSATION_STREAM_CHANNEL, bridgeListener);
  bridgeAttached = true;
}

export default class AiService {
  static async listRuntimeAgents(): Promise<AiResult<RuntimeAgentVo[]>> {
    return wrap(() => AiController.listRuntimeAgents());
  }

  static async getRuntimeSettings(): Promise<AiResult<RuntimeSettingsVo>> {
    return wrap(() => AiController.getRuntimeSettings());
  }

  static async putRuntimeSettings(body: PutRuntimeSettingsRequestVo): Promise<AiResult<RuntimeSettingsVo>> {
    return wrap(() => AiController.putRuntimeSettings(body));
  }

  static async getRuntimeSelection(): Promise<AiResult<RuntimeSelectionVo>> {
    return wrap(() => AiController.getRuntimeSelection());
  }

  static async putRuntimeSelection(body: PutRuntimeSelectionRequestVo): Promise<AiResult<RuntimeSelectionVo>> {
    return wrap(() => AiController.putRuntimeSelection(body));
  }

  static async ensureResourceConversation(
    body: EnsureResourceConversationRequestVo
  ): Promise<AiResult<EnsureResourceConversationResponseVo>> {
    return wrap(() => AiController.ensureResourceConversation(body));
  }

  static async listConversations(): Promise<AiResult<ConversationVo[]>> {
    return wrap(() => AiController.listConversations());
  }

  static async searchResourceMentions(query = ''): Promise<AiResult<AiResourceMentionVo[]>> {
    return wrap(() => AiController.searchResourceMentions(query));
  }

  static async createConversation(body?: CreateConversationRequestVo): Promise<AiResult<ConversationVo>> {
    return wrap(() => AiController.createConversation(body || {}));
  }

  static async ensureCaptureInbox(): Promise<AiResult<ConversationVo>> {
    return wrap(() => AiController.ensureCaptureInbox());
  }

  static async patchConversationRuntime(
    conversationId: string,
    body: PatchConversationRuntimeRequestVo
  ): Promise<AiResult<ConversationVo>> {
    return wrap(() => AiController.patchConversationRuntime(conversationId, body));
  }

  static async renameConversation(
    conversationId: string,
    body: RenameConversationRequestVo
  ): Promise<AiResult<ConversationVo>> {
    return wrap(() => AiController.renameConversation(conversationId, body));
  }

  static async pinConversation(
    conversationId: string,
    body: PinConversationRequestVo
  ): Promise<AiResult<ConversationVo>> {
    return wrap(() => AiController.pinConversation(conversationId, body));
  }

  static async deleteConversation(conversationId: string): Promise<AiResult<void>> {
    return wrap(() => AiController.deleteConversation(conversationId));
  }

  static async listMessages(conversationId: string): Promise<AiResult<MessageVo[]>> {
    return wrap(() => AiController.listMessages(conversationId));
  }

  static async startMessageStream(
    conversationId: string,
    body: StartMessageStreamRequestVo
  ): Promise<AiResult<StartMessageStreamResponseVo>> {
    return wrap(() => AiController.startMessageStream(conversationId, body));
  }

  static async cancelMessageStream(streamId: string): Promise<AiResult<CancelStreamResponseVo>> {
    return wrap(() => AiController.cancelMessageStream(streamId));
  }

  static async patchWorkspace(
    messageId: string,
    body: PatchWorkspaceRequestVo
  ): Promise<AiResult<MessageVo>> {
    return wrap(() => AiController.patchWorkspace(messageId, body));
  }

  static subscribeChatStream(handler: StreamHandler): () => void {
    ensureStreamBridge();
    streamListeners.add(handler);
    return () => {
      streamListeners.delete(handler);
    };
  }

  static unsubscribeChatStream(handler: StreamHandler): void {
    streamListeners.delete(handler);
  }
}
