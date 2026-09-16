import { PLUGIN_HUB_PATH } from '@true-north/plugin-sdk';

export const pluginPaths = {
  root: PLUGIN_HUB_PATH,
} as const;

export function isPluginsPath(pathname: string) {
  return pathname === pluginPaths.root || pathname.startsWith(`${pluginPaths.root}/`);
}

export function isPluginCenterPath(pathname: string) {
  return pathname === pluginPaths.root;
}
