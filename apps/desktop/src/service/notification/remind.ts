export type NotifyMode = 'upsert' | 'remind';

export type PostAction = 'skip' | 'create' | 'upsert';

export function notifyModeOf(value?: string): NotifyMode {
  return value === 'remind' ? 'remind' : 'upsert';
}

export function decidePostAction(input: {
  mode: NotifyMode;
  muted: boolean;
  hasUnread: boolean;
  hasExisting: boolean;
}): PostAction {
  if (input.muted) return 'skip';
  if (input.mode === 'remind') {
    if (input.hasUnread) return 'skip';
    return 'create';
  }
  if (input.hasExisting) return 'upsert';
  return 'create';
}
