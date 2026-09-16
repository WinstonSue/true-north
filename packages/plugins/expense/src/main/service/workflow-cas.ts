import { pluginResourceUri } from '@true-north/plugin-contract';

export function transactionUri(id: string) {
  return pluginResourceUri('expense', 'transactions', id);
}
