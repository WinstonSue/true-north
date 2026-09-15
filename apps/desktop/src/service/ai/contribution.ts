import { attachAgentToolRegistry, type AgentToolRegistry } from './agent/tools';
import { addAgentInstructions } from './runtime/agent-instructions';
import { attachPluginAiRegistry, type PluginAiRegistry } from './plugin-ai.registry';

export function attachAiRegistries(registries: {
  agentTools: AgentToolRegistry;
  pluginAi: PluginAiRegistry;
}) {
  attachAgentToolRegistry(registries.agentTools);
  attachPluginAiRegistry(registries.pluginAi);
}

export function registerHostAiInstructions(text?: string) {
  if (text?.trim()) addAgentInstructions(text.trim());
}
