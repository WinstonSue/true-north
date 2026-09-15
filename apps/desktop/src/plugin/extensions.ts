import { ExtensionRegistry } from '@true-north/plugin-sdk';

let attached: ExtensionRegistry | null = null;

export function attachMainExtensions(registry: ExtensionRegistry | null) {
  attached = registry;
}

export function getMainExtensionsOptional() {
  return attached;
}
