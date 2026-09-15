# AI Platform

```yaml
document_meta:
  status: 'active'
  last_updated: '2026-09-15'
```

参见 [AI 域总览](./README.md)。通用 Desktop 分层不在此复述。协议细节见 [Plugin Platform](../plugin-platform.md)。

AI 会话与 Workbench 是宿主平台，不是插件。宿主维护单一聚合 MCP（`true_north`）、会话流、审计与取消。插件提供 Skills 目录以及 MCP `tools/resources/prompts`。宿主不读取插件实体目录，也不理解 `goal/task` 业务类型。

## 1. 注册表

- `AgentToolRegistry` 聚合已命名 MCP 工具（`growth.searchGoals`）。重复 name 抛错。
- `PluginAiRegistry` 按 pluginId 保存 tools/resources/prompts 与 skill 根目录。
- 插件内部拆解仍可走插件 service（如 Growth decompose capability），但只由插件 MCP tool 调用，宿主不再暴露 `/ai/capabilities/*`。
- `AGENTS.md` 只写宿主约束与 Skills 索引；Skill 正文留在 `skills/{pluginId}/{id}/SKILL.md`。

## 2. 会话附件

会话保存 `attachments: [{ uri, label?, skill? }]`。插件通过 `host.ai.start` 传入资源 URI。宿主只持久化/转发这些值，打开详情走 `platform.openResource(uri)`。

## 3. 双入口 View

插件页与 Workbench 共享 `PluginViewSnapshot` 与同一 Feature。Page adapter 写 `?view=`；Workbench 同 view 单标签并递增 revision。
