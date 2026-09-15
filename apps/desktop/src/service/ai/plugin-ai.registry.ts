import type { AgentTool, PluginPromptProvider, PluginResourceProvider } from '@true-north/plugin-sdk';
import type { MaterializedMain } from '@true-north/plugin-sdk';

export class PluginAiRegistry {
  private readonly tools = new Map<string, AgentTool>();
  private readonly resources: Array<{
    pluginId: string;
    localId: string;
    uriTemplate: string;
    provider: PluginResourceProvider;
  }> = [];
  private readonly prompts = new Map<
    string,
    { pluginId: string; localId: string; name: string; provider: PluginPromptProvider }
  >();
  private readonly skillRoots = new Map<string, Record<string, string>>();

  register(pluginId: string, materialized: MaterializedMain) {
    for (const tool of materialized.tools) {
      if (!tool.name) continue;
      if (this.tools.has(tool.name)) {
        throw new Error(`重复注册 MCP 工具: ${tool.name}`);
      }
      this.tools.set(tool.name, { ...tool, name: tool.name });
    }
    for (const resource of materialized.resources) {
      this.resources.push({ pluginId, ...resource });
    }
    for (const prompt of materialized.prompts) {
      if (this.prompts.has(prompt.name)) {
        throw new Error(`重复注册 MCP prompt: ${prompt.name}`);
      }
      this.prompts.set(prompt.name, { pluginId, ...prompt });
    }
    if (Object.keys(materialized.skillRoots).length) {
      this.skillRoots.set(pluginId, materialized.skillRoots);
    }
  }

  unregister(pluginId: string): string[] {
    const toolNames = [...this.tools.keys()].filter(
      (name) => name === pluginId || name.startsWith(`${pluginId}.`),
    );
    for (const name of toolNames) this.tools.delete(name);
    for (let index = this.resources.length - 1; index >= 0; index -= 1) {
      if (this.resources[index]?.pluginId === pluginId) this.resources.splice(index, 1);
    }
    for (const [name, prompt] of this.prompts) {
      if (prompt.pluginId === pluginId) this.prompts.delete(name);
    }
    this.skillRoots.delete(pluginId);
    return toolNames;
  }

  listTools(): AgentTool[] {
    return [...this.tools.values()];
  }

  findTool(name: string) {
    return this.tools.get(name);
  }

  async listResources() {
    const listed = await Promise.all(
      this.resources.map(async (item) => {
        const rows = await item.provider.list();
        return rows.map((row) => ({
          uri: row.uri,
          name: row.name || item.localId,
          mimeType: row.mimeType,
          pluginId: item.pluginId,
        }));
      }),
    );
    return listed.flat();
  }

  listResourceTemplates() {
    return this.resources
      .filter((item) => item.uriTemplate.includes('{'))
      .map((item) => ({
        uriTemplate: item.uriTemplate,
        name: `${item.pluginId}.${item.localId}`,
      }));
  }

  async readResource(uri: string) {
    for (const item of this.resources) {
      const content = await item.provider.read(uri);
      if (content) return content;
    }
    return null;
  }

  listPrompts() {
    return [...this.prompts.values()].map((item) => ({
      name: item.name,
      description: item.provider.description,
      arguments: item.provider.arguments,
    }));
  }

  async getPrompt(name: string, args: Record<string, string>) {
    const found = this.prompts.get(name);
    if (!found) return null;
    return found.provider.get(args);
  }

  allSkillRoots() {
    return [...this.skillRoots.entries()].map(([pluginId, roots]) => ({ pluginId, roots }));
  }
}

let attached: PluginAiRegistry | null = null;

export function attachPluginAiRegistry(registry: PluginAiRegistry) {
  attached = registry;
}

export function pluginAiRegistry(): PluginAiRegistry {
  if (!attached) throw new Error('Plugin AI registry is not attached');
  return attached;
}

export function getPluginAiRegistryOptional() {
  return attached;
}
