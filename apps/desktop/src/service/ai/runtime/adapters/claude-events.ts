function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

export type ClaudeEventState = {
  lastText: string;
  sessionId?: string;
};

export type ClaudeDelta = {
  delta?: string;
  sessionId?: string;
  next: ClaudeEventState;
};

function emitAppend(state: ClaudeEventState, delta: string): ClaudeDelta {
  if (!delta) return { next: state, sessionId: state.sessionId };
  return {
    delta,
    sessionId: state.sessionId,
    next: { ...state, lastText: state.lastText + delta },
  };
}

function takeSessionId(event: Record<string, unknown>, state: ClaudeEventState): string | undefined {
  return (
    asString(event.session_id) ||
    asString(event.sessionId) ||
    (isRecord(event.message) ? asString(event.message.session_id) : undefined) ||
    state.sessionId
  );
}

function collectAssistantText(event: Record<string, unknown>): string {
  const message = isRecord(event.message) ? event.message : event;
  const content = message.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((block) => {
      if (!isRecord(block)) return '';
      if (asString(block.type) && asString(block.type) !== 'text') return '';
      return asString(block.text) || '';
    })
    .join('');
}

export function extractClaudeDelta(event: Record<string, unknown>, state: ClaudeEventState): ClaudeDelta {
  const type = asString(event.type);
  const sessionId = takeSessionId(event, state);
  const nextState = sessionId && sessionId !== state.sessionId ? { ...state, sessionId } : state;

  if (type === 'stream_event') {
    const nested = isRecord(event.event) ? event.event : undefined;
    const delta = isRecord(nested?.delta) ? nested.delta : isRecord(event.delta) ? event.delta : undefined;
    const deltaType = delta ? asString(delta.type) : undefined;
    const text = delta ? asString(delta.text) : undefined;
    if (deltaType === 'text_delta' && text) {
      return emitAppend({ ...nextState, sessionId: sessionId || nextState.sessionId }, text);
    }
    return { sessionId, next: { ...nextState, sessionId: sessionId || nextState.sessionId } };
  }

  if (type === 'assistant') {
    return { sessionId, next: { ...nextState, sessionId: sessionId || nextState.sessionId } };
  }

  if (type === 'result' || type === 'system') {
    return { sessionId, next: { ...nextState, sessionId: sessionId || nextState.sessionId } };
  }

  return { sessionId, next: { ...nextState, sessionId: sessionId || nextState.sessionId } };
}

export function extractClaudeCompleteText(event: Record<string, unknown>): string {
  if (asString(event.type) !== 'assistant') return '';
  return collectAssistantText(event);
}
