import { request } from '../request';
import type {
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

export default class AiController {
  static async listConversations() {
    return request<ConversationVo[]>({ method: 'get' })(`/ai/conversations`);
  }

  static async searchResourceMentions(query = '') {
    return request<AiResourceMentionVo[]>({ method: 'get' })(`/ai/resources/mentions`, { query });
  }

  static async createConversation(body: CreateConversationRequestVo) {
    return request<ConversationVo>({ method: 'post' })(`/ai/conversations`, body);
  }

  static async ensureCaptureInbox() {
    return request<ConversationVo>({ method: 'post' })(`/ai/conversations/capture`);
  }

  static async listMessages(id: string) {
    return request<MessageVo[]>({ method: 'get' })(`/ai/conversations/${id}/messages`);
  }

  static async startMessageStream(id: string, body: StartMessageStreamRequestVo) {
    return request<StartMessageStreamResponseVo>({ method: 'post' })(`/ai/conversations/${id}/messages/stream`, body);
  }

  static async cancelMessageStream(streamId: string) {
    return request<CancelStreamResponseVo>({ method: 'post' })(`/ai/conversations/streams/${streamId}/cancel`);
  }

  static async patchWorkspace(id: string, body: PatchWorkspaceRequestVo) {
    return request<MessageVo>({ method: 'put' })(`/ai/messages/${id}/workspace`, body);
  }

  static async listRuntimeAgents() {
    return request<RuntimeAgentVo[]>({ method: 'get' })(`/ai/runtime/agents`);
  }

  static async getRuntimeSettings() {
    return request<RuntimeSettingsVo>({ method: 'get' })(`/ai/runtime/settings`);
  }

  static async putRuntimeSettings(body: PutRuntimeSettingsRequestVo) {
    return request<RuntimeSettingsVo>({ method: 'put' })(`/ai/runtime/settings`, body);
  }

  static async getRuntimeSelection() {
    return request<RuntimeSelectionVo>({ method: 'get' })(`/ai/runtime/selection`);
  }

  static async putRuntimeSelection(body: PutRuntimeSelectionRequestVo) {
    return request<RuntimeSelectionVo>({ method: 'put' })(`/ai/runtime/selection`, body);
  }

  static async ensureResourceConversation(body: EnsureResourceConversationRequestVo) {
    return request<EnsureResourceConversationResponseVo>({ method: 'post' })(`/ai/conversations/resource`, body);
  }

  static async patchConversationRuntime(id: string, body: PatchConversationRuntimeRequestVo) {
    return request<ConversationVo>({ method: 'put' })(`/ai/conversations/${id}/runtime`, body);
  }

  static async renameConversation(id: string, body: RenameConversationRequestVo) {
    return request<ConversationVo>({ method: 'put' })(`/ai/conversations/${id}`, body);
  }

  static async pinConversation(id: string, body: PinConversationRequestVo) {
    return request<ConversationVo>({ method: 'put' })(`/ai/conversations/${id}/pin`, body);
  }

  static async deleteConversation(id: string) {
    return request<void>({ method: 'remove' })(`/ai/conversations/${id}`);
  }
}
