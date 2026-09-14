import type { AiChatStreamEventVo, AiTextPartVo, MessageVo } from '@true-north/vo';

export type ActiveStream = {
  streamId: string;
  conversationId: string;
  assistantId: string;
  autoOpenOnDone: boolean;
  suppressError: boolean;
};

export type StreamRegistry = Record<string, ActiveStream>;

export function upsertStream(registry: StreamRegistry, stream: ActiveStream): StreamRegistry {
  const next: StreamRegistry = {};
  for (const [id, item] of Object.entries(registry)) {
    if (item.conversationId !== stream.conversationId) next[id] = item;
  }
  next[stream.streamId] = stream;
  return next;
}

export function removeStream(registry: StreamRegistry, streamId: string): StreamRegistry {
  if (!(streamId in registry)) return registry;
  const next = { ...registry };
  delete next[streamId];
  return next;
}

export function findStreamById(
  registry: StreamRegistry,
  streamId: string
): ActiveStream | undefined {
  return registry[streamId];
}

export function findStreamByConversation(
  registry: StreamRegistry,
  conversationId: string | null | undefined
): ActiveStream | undefined {
  if (!conversationId) return undefined;
  return Object.values(registry).find((item) => item.conversationId === conversationId);
}

export function streamingConversationIds(registry: StreamRegistry): string[] {
  return [...new Set(Object.values(registry).map((item) => item.conversationId))];
}

export function markStreamSuppressError(registry: StreamRegistry, streamId: string): StreamRegistry {
  const current = registry[streamId];
  if (!current || current.suppressError) return registry;
  return { ...registry, [streamId]: { ...current, suppressError: true } };
}

export function patchConversationMessages(
  cache: Record<string, MessageVo[]>,
  conversationId: string,
  updater: (messages: MessageVo[]) => MessageVo[]
): Record<string, MessageVo[]> {
  return {
    ...cache,
    [conversationId]: updater(cache[conversationId] || []),
  };
}

export function appendDelta(item: MessageVo, delta: string): MessageVo {
  const parts = [...(item.parts || [])];
  const last = parts[parts.length - 1];
  if (last && last.type === 'text') {
    parts[parts.length - 1] = { ...last, text: `${last.text || ''}${delta}` };
  } else {
    parts.push({ type: 'text', text: delta });
  }
  return { ...item, parts };
}

export function applyDeltaToMessages(
  messages: MessageVo[],
  assistantId: string,
  delta: string
): MessageVo[] {
  return messages.map((item) => (item.id === assistantId ? appendDelta(item, delta) : item));
}

function concatTextParts(parts: MessageVo['parts']): string {
  return parts
    .filter((part): part is AiTextPartVo => part.type === 'text')
    .map((part) => part.text || '')
    .join('');
}

function collectLinks(parts: MessageVo['parts']): NonNullable<AiTextPartVo['entityLinks']> {
  const links: NonNullable<AiTextPartVo['entityLinks']> = [];
  for (const part of parts) {
    if (part.type === 'text') links.push(...(part.entityLinks || []));
  }
  return links;
}

export function mergeAssistantMessage(local: MessageVo, incoming: MessageVo): MessageVo {
  const localParts = local.parts || [];
  const incomingParts = incoming.parts || [];
  const localText = concatTextParts(localParts);
  const incomingText = concatTextParts(incomingParts);
  const localLinks = collectLinks(localParts);
  const incomingLinks = collectLinks(incomingParts);

  let text = incomingText;
  let entityLinks = incomingLinks;
  if (localText.startsWith(incomingText) || incomingText.startsWith(localText)) {
    if (localText.length >= incomingText.length) {
      text = localText;
      entityLinks = localLinks;
    }
  }

  const textPart: AiTextPartVo = entityLinks.length
    ? { type: 'text', text, entityLinks }
    : { type: 'text', text };
  const parts: MessageVo['parts'] = [];
  let insertedText = false;
  for (const part of incomingParts) {
    if (part.type === 'text') {
      if (!insertedText) {
        parts.push(textPart);
        insertedText = true;
      }
    } else {
      parts.push(part);
    }
  }
  if (!insertedText && text) parts.unshift(textPart);

  return { ...incoming, parts };
}

export function applyMessageToList(messages: MessageVo[], incoming: MessageVo): MessageVo[] {
  let found = false;
  const next = messages.map((item) => {
    if (item.id !== incoming.id) return item;
    found = true;
    return mergeAssistantMessage(item, incoming);
  });
  return found ? next : [...next, incoming];
}

export const PENDING_STREAM_TTL_MS = 15_000;
export const PENDING_STREAM_MAX_EVENTS = 200;

export type PendingStreamBuffers = Record<
  string,
  {
    startedAt: number;
    events: AiChatStreamEventVo[];
  }
>;

export function prunePendingStreamEvents(
  buffer: PendingStreamBuffers,
  now = Date.now()
): PendingStreamBuffers {
  let changed = false;
  const next: PendingStreamBuffers = {};
  for (const [streamId, item] of Object.entries(buffer)) {
    if (now - item.startedAt > PENDING_STREAM_TTL_MS) {
      changed = true;
      continue;
    }
    next[streamId] = item;
  }
  return changed ? next : buffer;
}

export function enqueuePendingStreamEvent(
  buffer: PendingStreamBuffers,
  event: AiChatStreamEventVo,
  now = Date.now()
): PendingStreamBuffers {
  const pruned = prunePendingStreamEvents(buffer, now);
  const existing = pruned[event.streamId];
  const startedAt = existing?.startedAt ?? now;
  if (now - startedAt > PENDING_STREAM_TTL_MS) {
    const dropped = { ...pruned };
    delete dropped[event.streamId];
    return dropped;
  }
  const events = [...(existing?.events || []), event].slice(-PENDING_STREAM_MAX_EVENTS);
  return { ...pruned, [event.streamId]: { startedAt, events } };
}

export function takePendingStreamEvents(
  buffer: PendingStreamBuffers,
  streamId: string
): { buffer: PendingStreamBuffers; events: AiChatStreamEventVo[] } {
  const item = buffer[streamId];
  if (!item) return { buffer, events: [] };
  const next = { ...buffer };
  delete next[streamId];
  return { buffer: next, events: item.events };
}

export function applyPendingEventsToMessages(
  messages: MessageVo[],
  assistantId: string,
  events: AiChatStreamEventVo[]
): MessageVo[] {
  let next = messages;
  for (const event of events) {
    if (event.event === 'delta') {
      next = applyDeltaToMessages(next, assistantId, event.delta);
    } else if (event.event === 'message' || event.event === 'done') {
      next = applyMessageToList(next, event.message);
    }
  }
  return next;
}

export function pendingStreamTerminal(
  events: AiChatStreamEventVo[]
): Extract<AiChatStreamEventVo, { event: 'done' | 'error' }> | undefined {
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event = events[i];
    if (event.event === 'done' || event.event === 'error') return event;
  }
  return undefined;
}

export function materializeBeginStream(input: {
  cache: Record<string, MessageVo[]>;
  registry: StreamRegistry;
  pending: PendingStreamBuffers;
  conversationId: string;
  streamId: string;
  user: MessageVo;
  assistant: MessageVo;
  autoOpenOnDone?: boolean;
}): {
  cache: Record<string, MessageVo[]>;
  registry: StreamRegistry;
  pending: PendingStreamBuffers;
  terminal?: Extract<AiChatStreamEventVo, { event: 'done' | 'error' }>;
} {
  const taken = takePendingStreamEvents(input.pending, input.streamId);
  const cache = patchConversationMessages(input.cache, input.conversationId, (msgs) => {
    const next = [...msgs];
    if (!next.some((item) => item.id === input.user.id)) next.push(input.user);
    if (!next.some((item) => item.id === input.assistant.id)) next.push(input.assistant);
    return applyPendingEventsToMessages(next, input.assistant.id, taken.events);
  });
  let registry = upsertStream(input.registry, {
    streamId: input.streamId,
    conversationId: input.conversationId,
    assistantId: input.assistant.id,
    autoOpenOnDone: input.autoOpenOnDone ?? false,
    suppressError: false,
  });
  const terminal = pendingStreamTerminal(taken.events);
  if (terminal) registry = removeStream(registry, input.streamId);
  return { cache, registry, pending: taken.buffer, terminal };
}

export function applyFetchedMessages(
  cache: Record<string, MessageVo[]>,
  conversationId: string,
  incoming: MessageVo[],
  streaming: boolean
): Record<string, MessageVo[]> {
  if (!streaming) {
    return { ...cache, [conversationId]: incoming };
  }
  return patchConversationMessages(cache, conversationId, (local) => {
    let next = local;
    for (const item of incoming) {
      next = applyMessageToList(next, item);
    }
    return next;
  });
}
