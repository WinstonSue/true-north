import { z } from 'zod';
import { extensionPoints, type AgentTool, type AgentToolContext } from '@true-north/plugin-sdk';
import { getMainExtensionsOptional } from '../../../plugin/extensions.ts';

export type ToolExecutionContext = AgentToolContext;

export type { AgentTool };

export function findAgentTool(name: string): AgentTool | undefined {
  return getMainExtensionsOptional()?.get(extensionPoints.mcpTool, name);
}

export function listAgentTools(): AgentTool[] {
  return getMainExtensionsOptional()?.list(extensionPoints.mcpTool) || [];
}

function summarizeArgs(args: Record<string, unknown>): string {
  const entries = Object.entries(args)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}=${value.length}项`;
      return `${key}=${String(value)}`;
    })
    .slice(0, 3);
  return entries.join(', ');
}

export function summarizeToolArgs(args: Record<string, unknown>): string {
  return summarizeArgs(args);
}

export async function executeAgentTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ToolExecutionContext
): Promise<{ ok: boolean; result: string; args: Record<string, unknown> }> {
  const tool = findAgentTool(name);
  if (!tool) {
    return { ok: false, result: `未知工具: ${name}`, args };
  }
  try {
    const parsed = tool.schema.parse(args) as Record<string, unknown>;
    const result = await tool.execute(parsed, ctx);
    return { ok: true, result, args: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        result: '工具参数无效，请按该工具 schema 修正后重试。',
        args,
      };
    }
    const message = error instanceof Error ? error.message : '工具执行失败';
    return { ok: false, result: message, args };
  }
}

export function parseToolArguments(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}
