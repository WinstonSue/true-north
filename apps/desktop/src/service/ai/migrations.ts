import type { PluginStorageHandle } from '@true-north/plugin-sdk/main';

export const aiMigrations = [
  {
    id: 'ai.v1.workspace-refs',
    version: 1,
    async up(storage: PluginStorageHandle) {
      const tables = (await storage.query(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('ai_message')",
      )) as Array<{ name: string }>;
      const tableNames = new Set((tables || []).map((table) => table.name));
      if (!tableNames.has('ai_message')) return;

      const messages = (await storage.query(
        `SELECT id, parts FROM ai_message WHERE deleted_at IS NULL`,
      )) as Array<{ id: string; parts: string }>;

      for (const message of messages) {
        if (!message.parts) continue;
        let parts: unknown;
        try {
          parts = typeof message.parts === 'string' ? JSON.parse(message.parts) : message.parts;
        } catch {
          continue;
        }
        if (!Array.isArray(parts)) continue;
        let changed = false;
        const nextParts = parts.map((raw) => {
          if (!raw || typeof raw !== 'object') return raw;
          const part = raw as Record<string, unknown>;
          if (part.type === 'text' && part.entityLink && !part.entityLinks) {
            changed = true;
            const { entityLink, ...rest } = part;
            return { ...rest, entityLinks: [entityLink] };
          }
          return part;
        });
        if (!changed) continue;
        await storage.query(`UPDATE ai_message SET parts = ? WHERE id = ?`, [JSON.stringify(nextParts), message.id]);
      }
    },
  },
];
