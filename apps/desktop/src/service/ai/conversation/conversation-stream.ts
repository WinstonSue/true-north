const conversationStreams = new Map<string, string>();
const streamConversations = new Map<string, string>();

export const CONVERSATION_BUSY_MESSAGE = '该会话正在生成，请先停止或等待完成';

export function activeStreamIdForConversation(conversationId: string): string | undefined {
  return conversationStreams.get(conversationId);
}

export function claimConversationStream(
  conversationId: string,
  streamId: string
): { ok: true } | { ok: false; message: string } {
  const existing = conversationStreams.get(conversationId);
  if (existing) return { ok: false, message: CONVERSATION_BUSY_MESSAGE };
  conversationStreams.set(conversationId, streamId);
  streamConversations.set(streamId, conversationId);
  return { ok: true };
}

export function conversationIdForStream(streamId: string): string | undefined {
  return streamConversations.get(streamId);
}

export function releaseConversationStream(streamId: string): void {
  const conversationId = streamConversations.get(streamId);
  if (conversationId && conversationStreams.get(conversationId) === streamId) {
    conversationStreams.delete(conversationId);
  }
  streamConversations.delete(streamId);
}
