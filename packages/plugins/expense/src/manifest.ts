import { definePluginManifest } from '@true-north/plugin-contract';
import { version } from '../package.json';

export const expenseManifest = definePluginManifest({
  pluginId: 'expense',
  version,
  catalog: {
    nameKey: 'menu.expense',
    descriptionKey: 'expense.hub.description',
    categoryKey: 'plugins.category.builtin',
    keywords: ['expense', 'budget', 'transaction', '记账', '预算', '账单'],
    order: 20,
  },
  contributions: {
    ipc: { expense: {} },
    hub: {},
    resources: {
      transaction: { uriTemplate: 'tn://expense/transactions/{id}' },
    },
    workbench: {
      workspaces: { suggestTransaction: {} },
    },
    workflow: {
      events: {
        transactionBooked: { payloadSchema: { type: 'object' } },
        transactionDeleted: { payloadSchema: { type: 'object' } },
      },
      commands: {
        createTransaction: {
          inputSchema: { type: 'object' },
          idempotent: true,
          compensate: 'deleteTransaction',
        },
        deleteTransaction: { inputSchema: { type: 'object' }, idempotent: true },
      },
      templates: {
        todoCompleteExpenseConfirm: {
          nameKey: 'workflow.template.todoCompleteExpense',
          descriptionKey: 'workflow.template.todoCompleteExpense.description',
          graph: {
            schemaVersion: 1,
            start: { eventContributionId: 'growth.todoCompleted' },
            nodes: [
              { key: 'confirm', kind: 'workspace', contributionId: 'expense.suggestTransaction' },
              { key: 'create', kind: 'command', contributionId: 'expense.createTransaction' },
            ],
            edges: [
              { key: 'e1', from: 'start', to: 'confirm' },
              { key: 'e2', from: 'confirm', to: 'create' },
            ],
            bindings: [
              { from: 'event.payload.title', to: 'confirm.input.title' },
              { from: 'event.payload.occurredAt', to: 'confirm.input.occurredAt' },
              { from: 'confirm.output', to: 'create.input' },
            ],
            rollbackPolicy: 'confirmThenCompensate',
          },
        },
      },
    },
    ai: {
      mcp: {
        tools: {
          suggestTransaction: {},
        },
      },
    },
  },
});

export default expenseManifest;
