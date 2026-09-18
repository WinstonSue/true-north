import { Wallet } from 'lucide-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { expenseManifest } from '../manifest';
import { expenseLocales } from './locales';
import { bindPluginIpc } from '../client';
import { ExpensesProvider } from './pages/context';
import { suggestTransactionTool } from './contributions/suggest';

export function createRenderer() {
  return defineRendererImplementation(expenseManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: Wallet,
        locales: [expenseLocales],
        scope: ExpensesProvider,
        hub: {
          load: () => import('./layout/ExpensePage'),
        },
        workbench: {
          workspaces: {
            suggestTransaction: suggestTransactionTool,
          },
        },
        openResource(uri) {
          const parsed = parsePluginResourceUri(uri);
          if (!parsed || parsed.pluginId !== 'expense') return null;
          return {
            pluginId: 'expense',
            location: parsed.id ? { view: 'transaction', id: parsed.id } : { view: 'transaction' },
          };
        },
      };
    },
  });
}
