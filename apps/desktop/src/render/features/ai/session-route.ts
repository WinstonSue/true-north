export function resolveRequestedConversation(input: {
  requestedId: string | null;
  conversationIds: string[];
  loaded: boolean;
}): { action: 'blank' } | { action: 'pending'; id: string } | { action: 'open'; id: string } {
  if (!input.requestedId) return { action: 'blank' };
  if (input.conversationIds.includes(input.requestedId)) {
    return { action: 'open', id: input.requestedId };
  }
  if (!input.loaded) return { action: 'pending', id: input.requestedId };
  return { action: 'blank' };
}
