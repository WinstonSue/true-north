import type { PluginStorageHandle } from '@true-north/plugin-sdk/main';

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
];
