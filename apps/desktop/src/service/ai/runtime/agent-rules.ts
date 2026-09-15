export type RegisteredAgentRule = {
  pluginId: string;
  id: string;
  description: string;
  tools?: string[];
};

const rules: RegisteredAgentRule[] = [];

export function addAgentRules(
  pluginId: string,
  incoming: Array<{ id: string; description: string; tools?: string[] }>,
) {
  for (const rule of incoming) {
    const id = rule.id.trim();
    const description = rule.description.trim();
    if (!id || !description) continue;
    if (rules.some((item) => item.id === id)) {
      throw new Error(`Duplicate agent rule "${id}"`);
    }
    rules.push({
      pluginId,
      id,
      description,
      tools: rule.tools?.map((tool) => tool.trim()).filter(Boolean),
    });
  }
}

export function listAgentRules(): RegisteredAgentRule[] {
  return [...rules].sort((a, b) => a.id.localeCompare(b.id));
}

export function resetAgentRules() {
  rules.length = 0;
}

export function formatAgentRulesSection(items: RegisteredAgentRule[] = listAgentRules()): string {
  if (!items.length) return '';
  const lines = items.map((rule) => {
    const tools = rule.tools?.length ? `适用于 ${rule.tools.join('、')}：` : '';
    return `- [${rule.id}] ${tools}${rule.description}`;
  });
  return `插件规则：\n${lines.join('\n')}`;
}
