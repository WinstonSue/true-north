import { pluginResourceUri, parsePluginResourceUri } from '@true-north/plugin-contract';

export function transactionUri(id: string) {
  return pluginResourceUri('expense', 'transactions', id);
}

export function parseTransactionId(uri?: string) {
  const parsed = parsePluginResourceUri(uri || '');
  if (!parsed || parsed.pluginId !== 'expense' || parsed.collection !== 'transactions') return null;
  return parsed.id;
}
