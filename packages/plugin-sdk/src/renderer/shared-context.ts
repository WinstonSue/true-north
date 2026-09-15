import { createContext, type Context } from 'react';

/**
 * Vite HMR re-evaluates modules and would otherwise create a second React
 * context, so a Provider from the previous instance cannot be read by new hooks.
 */
export function sharedReactContext<T>(key: string, initial: T): Context<T> {
  const store = globalThis as unknown as Record<string, Context<T> | undefined>;
  if (!store[key]) store[key] = createContext(initial);
  return store[key];
}
