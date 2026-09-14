import { resolveDefaultRuntimeId } from '../runtime/preferred-agent.ts';

export function runtimeIdForConversation(
  conversationRuntimeId?: string | null,
  defaultRuntimeId?: string | null
): string {
  const sessionId = conversationRuntimeId?.trim();
  if (sessionId) return sessionId;
  return resolveDefaultRuntimeId(defaultRuntimeId);
}

export function shouldResumeRuntimeThread(
  conversationRuntimeId: string | null | undefined,
  runtimeThreadId: string | null | undefined,
  selectedId: string
): boolean {
  return conversationRuntimeId === selectedId && Boolean(runtimeThreadId?.trim());
}

export function nextRuntimeThreadId(
  previousRuntimeId: string | null | undefined,
  nextRuntimeId: string,
  previousThreadId: string | null | undefined
): string | null {
  if (previousRuntimeId !== nextRuntimeId) return null;
  return previousThreadId?.trim() ? previousThreadId : null;
}
