import { z } from 'zod';
import type { AgentTool, PluginResourceProvider } from '@true-north/plugin-sdk';
import { contributionKey, pluginResourceUri } from '@true-north/plugin-contract';
import { store } from '../storage';
import { Bookmark } from './bookmark.entity';

export const librarySuggestKey = contributionKey('library', 'suggestBookmark');

const schema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  note: z.string().optional(),
});

export const suggestBookmarkTool: AgentTool = {
  name: 'suggest_bookmark',
  description: '把收藏网址理解成建议工作台。不要创建实体。',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      url: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['title', 'url'],
  },
  schema,
  async execute(args, ctx) {
    const parsed = schema.parse(args);
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: librarySuggestKey,
      payload: parsed,
    });
    return JSON.stringify({ ok: true, workspaceId, nodeId: workspaceId, hint: '收藏建议已写入工作台，等待确认。' });
  },
};

export const bookmarkResource: PluginResourceProvider = {
  list: async () => {
    const rows = await store().getRepository(Bookmark).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('library', 'bookmarks', row.id),
      name: row.title,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const prefix = 'tn://library/bookmarks/';
    if (!uri.startsWith(prefix)) return null;
    const row = await store().getRepository(Bookmark).findOneBy({ id: uri.slice(prefix.length) });
    if (!row) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({ id: row.id, title: row.title, url: row.url }),
    };
  },
};
