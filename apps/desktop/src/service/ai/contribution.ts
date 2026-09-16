import { extensionPoints, type AgentTool, type ExtensionRegistration } from '@true-north/plugin-sdk';
import { attachMainExtensions } from '../../plugin/extensions';
import type { ExtensionRegistry } from '@true-north/plugin-sdk';

export function attachAiRegistries(registry: ExtensionRegistry) {
  attachMainExtensions(registry);
}

export function hostAiRegistrations(input: {
  tools?: AgentTool[];
  agentInstructions?: string;
}): ExtensionRegistration[] {
  const registrations: ExtensionRegistration[] = [];
  for (const tool of input.tools || []) {
    if (!tool.name) continue;
    registrations.push({
      point: extensionPoints.mcpTool,
      key: tool.name,
      value: tool,
    });
  }
  if (input.agentInstructions?.trim()) {
    registrations.push({
      point: extensionPoints.agentInstruction,
      key: 'workflow',
      value: input.agentInstructions.trim(),
    });
  }
  return registrations;
}
