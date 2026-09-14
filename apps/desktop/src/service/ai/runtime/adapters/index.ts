import { AiPlatformError } from '../../ai-error';
import type { RuntimeAgentId } from '../types';
import { claudeCodeAdapter } from './claude-code';
import { codexAdapter } from './codex';
import { cursorAgentAdapter } from './cursor-agent';
import type { RuntimeAdapter } from './types';

const adapters: RuntimeAdapter[] = [codexAdapter, claudeCodeAdapter, cursorAgentAdapter];

export function listAdapters(): RuntimeAdapter[] {
  return adapters;
}

export function getAdapter(id: string): RuntimeAdapter | undefined {
  return adapters.find((item) => item.id === id);
}

export function requireAdapter(id: string): RuntimeAdapter {
  const adapter = getAdapter(id);
  if (!adapter) {
    throw AiPlatformError.agentUnavailable(`未知编码 Agent: ${id}`);
  }
  return adapter;
}

export type { RuntimeAdapter, RuntimeAgentId };
