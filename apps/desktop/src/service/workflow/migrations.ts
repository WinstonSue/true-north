import type { PluginStorageHandle } from '@true-north/plugin-sdk/main';

export function extrasAfterOldestByKey<T>(
  rows: T[],
  keyOf: (row: T) => string | undefined,
  createdAtOf: (row: T) => string | Date | undefined = (row) =>
    (row as { created_at?: string; createdAt?: Date }).created_at
    || (row as { createdAt?: Date }).createdAt,
): T[] {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const key = keyOf(row);
    if (!key) continue;
    const list = groups.get(key) || [];
    list.push(row);
    groups.set(key, list);
  }
  const extras: T[] = [];
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const sorted = [...list].sort((left, right) => {
      const a = createdAtOf(left);
      const b = createdAtOf(right);
      return (a ? new Date(a).getTime() : 0) - (b ? new Date(b).getTime() : 0);
    });
    extras.push(...sorted.slice(1));
  }
  return extras;
}

export const workflowMigrations = [
  {
    id: 'workflow.v1.attempt-idempotency-unique',
    version: 1,
    async up(storage: PluginStorageHandle) {
      const tables = (await storage.query(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'workflow_command_attempt'",
      )) as Array<{ name: string }>;
      if (!tables?.length) return;

      try {
        await storage.query(
          `CREATE UNIQUE INDEX IF NOT EXISTS "workflow_command_attempt_idempotency_key"
           ON "workflow_command_attempt" ("idempotency_key")`,
        );
      } catch {
        // existing duplicate keys keep the table usable; uniqueness is still enforced in-process
      }
    },
  },
  {
    id: 'workflow.v2.definition-source-template-unique',
    version: 2,
    async up(storage: PluginStorageHandle) {
      const tables = (await storage.query(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'workflow_definition'",
      )) as Array<{ name: string }>;
      if (!tables?.length) return;

      const rows = (await storage.query(
        `SELECT id, source_template_key, created_at FROM workflow_definition
         WHERE source_template_key IS NOT NULL AND source_template_key != ''`,
      )) as Array<{ id: string; source_template_key: string; created_at?: string }>;
      const extras = extrasAfterOldestByKey(rows, (row) => row.source_template_key);
      for (const extra of extras) {
        await storage.query('DELETE FROM workflow_definition WHERE id = ?', [extra.id]);
      }

      try {
        await storage.query(
          `CREATE UNIQUE INDEX IF NOT EXISTS "workflow_definition_source_template_key"
           ON "workflow_definition" ("source_template_key")
           WHERE source_template_key IS NOT NULL AND source_template_key != ''`,
        );
      } catch {
        // leftover duplicates keep the table usable; import is still serialized in-process
      }
    },
  },
];
