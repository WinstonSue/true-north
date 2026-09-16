import { z } from 'zod';
import type { AgentTool, PluginResourceProvider } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';
import { contributionKey } from '@true-north/plugin-contract';
import { store } from '../storage';
import { ExpenseTransaction } from './transaction.entity';

export const expenseSuggestKey = contributionKey('expense', 'suggestTransaction');

const schema = z.object({
  title: z.string().min(1),
  amount: z.coerce.number(),
  transactionType: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  occurredAt: z.string().optional(),
  note: z.string().optional(),
});

export const suggestTransactionTool: AgentTool = {
  name: 'suggest_transaction',
  description: '把已发生的支出或收入理解成建议工作台。不要创建实体。提醒去买东西不要用这个工具；只有已经花出去的钱才记。物资入库也不要用这个工具，除非用户同时说了金额。',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      amount: { type: 'number' },
      transactionType: { type: 'string', enum: ['income', 'expense'] },
      category: { type: 'string' },
      occurredAt: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['title', 'amount'],
  },
  schema,
  async execute(args, ctx) {
    const parsed = schema.parse(args);
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: expenseSuggestKey,
      payload: parsed,
    });
    return JSON.stringify({ ok: true, workspaceId, nodeId: workspaceId, hint: '账单建议已写入工作台，等待确认。' });
  },
};

export const expenseTransactionResource: PluginResourceProvider = {
  list: async () => {
    const rows = await store().getRepository(ExpenseTransaction).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('expense', 'transactions', row.id),
      name: row.description || row.category,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const prefix = 'tn://expense/transactions/';
    if (!uri.startsWith(prefix)) return null;
    const row = await store().getRepository(ExpenseTransaction).findOneBy({ id: uri.slice(prefix.length) });
    if (!row) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({
        id: row.id,
        amount: row.amount,
        category: row.category,
        revision: row.revision || 1,
      }),
    };
  },
};
