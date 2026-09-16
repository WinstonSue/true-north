import type { CommandResult } from '@true-north/plugin-contract';

export function decideCreateBookmark(input: { title?: string; url?: string }): CommandResult | { proceed: true } {
  if (!String(input.title || '').trim()) return { status: 'rejected', code: 'validation', reason: 'title required' };
  if (!String(input.url || '').trim()) return { status: 'rejected', code: 'validation', reason: 'url required' };
  return { proceed: true };
}
