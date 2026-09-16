import { pluginResourceUri } from '@true-north/plugin-contract';
import type { CommandResult, WorkflowCommandContext } from '@true-north/plugin-contract';
import type { WorkflowCommandHandler } from '@true-north/plugin-sdk';
import { runPluginCommand, revisionOf } from '@true-north/plugin-sdk/main';
import { store } from '../storage';
import { bookmarkService } from './bookmark.service';
import { decideCreateBookmark } from './workflow-cas';

function bookmarkUri(id: string) {
  return pluginResourceUri('library', 'bookmarks', id);
}

export const createBookmarkCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    return store().runInTransaction(async (tx) =>
      runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
        const body = (input || {}) as Record<string, unknown>;
        const decision = decideCreateBookmark({ title: String(body.title || ''), url: String(body.url || '') });
        if (!('proceed' in decision)) return decision;
        const created = await bookmarkService.create(
          {
            title: String(body.title || ''),
            url: String(body.url || ''),
            excerpt: body.note ? String(body.note) : undefined,
            tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
          },
          { manager: tx.manager },
        );
        const uri = bookmarkUri(created.id);
        const revision = revisionOf(1);
        return {
          status: 'applied',
          resource: { uri, revision },
          output: { id: created.id },
          events: [{ localId: 'bookmarkCreated', payload: { title: created.title }, source: { uri, revision } }],
        };
      }),
    );
  },
};
