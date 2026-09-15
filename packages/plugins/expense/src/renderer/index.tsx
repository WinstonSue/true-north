import { Wallet } from 'lucide-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { expenseManifest } from '../manifest';
import { expenseIds } from '../contract';
import { expenseLocales } from './locales';
import { bindPluginIpc } from '../client';
import { ExpensesProvider } from './pages/context';

export function createRenderer() {
  return defineRendererImplementation(expenseManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: Wallet,
        locales: [expenseLocales],
        scope: ExpensesProvider,
        views: {
          transaction: { load: () => import('./features/transaction') },
          budget: { load: () => import('./features/budget') },
          overview: { load: () => import('./features/overview') },
        },
        page: {
          load: () => import('./layout/ExpensePage'),
        },
        openResource(uri) {
          const parsed = parsePluginResourceUri(uri);
          if (!parsed || parsed.pluginId !== 'expense') return null;
          return {
            viewId: expenseIds.views.transaction,
            params: parsed.id ? { view: 'transaction', id: parsed.id } : { view: 'transaction' },
          };
        },
      };
    },
  });
}
