# AI Platform

```yaml
document_meta:
  status: 'active'
  last_updated: '2026-09-17'
```

参见 [AI 域总览](./README.md)。通用 Desktop 分层不在此复述。协议细节见 [Plugin Platform](../plugin-platform.md)。

AI 会话与 Workbench 是宿主平台，不是插件。宿主维护单一聚合 MCP（`true_north`）、会话流、审计与取消。插件提供 Skills 目录、MCP `tools` / `prompts`，以及最外层 `resources`（由宿主投影进 MCP）。宿主不读取插件实体目录，也不理解 `goal/task` 业务类型。

## 1. 注册表

- 宿主拥有统一扩展注册表：main 的 `DesktopPluginHost.extensions` 与 renderer 的 `RendererPlatform` registry 是同构、进程内实例，共享 typed extension-point、owner 生命周期和物化 registration。
- 插件贡献（IPC、Workflow commands/events/interactions、顶层 resources、MCP tools/prompts、Skills、agent instructions、composer mentions，以及 renderer 的 catalog/hub/workspaces/newTabs/actions/shell/locales/scopes/openers/host actions）都写入对应进程的 registry。`StorageRegistry` 与 Agent 运行时定义仍独立。
- 顶层 resource 可声明 `mention`；物化层从同一 resource provider 派生 `ai.composer.mention`，并投影进 MCP。聊天框 `@` 经 IPC `GET /ai/resources/mentions` 查询 main registry。
- 插件内部拆解仍可走插件 service（如 Growth decompose），但只由插件 MCP tool 调用，宿主不再暴露 `/ai/capabilities/*`。
- `AGENTS.md` 只写宿主约束与 Skills 索引；Skill 正文留在 `skills/{pluginId}/{id}/SKILL.md`。

## 2. 会话附件与消息引用

- 会话保存 `attachments: [{ uri, label?, skill? }]`。`skill` 是 `{pluginId}.{localId}`，例如 `workflow.conflictAssist`。宿主会校验已注册 Skill，并把首轮提示写成明确路径 `skills/{pluginId}/{localId}/SKILL.md`。自由字符串不能改变权限；冲突会话由冲突资源 URI 启用。
- 插件通过 `host.ai.start` 传入资源 URI。宿主只持久化/转发这些值，打开详情走 `platform.openResource(uri)` → Hub。

输入框 `@` 选中的资源写入**当前用户消息**的 `resourceLinks: [{ uri, label }]`，进入 Agent prompt 的名称与 URI；它不改会话级 `attachments`。消息上的资源 chip 同样经 `openResource(uri)` 打开对应插件页。

## 3. 入口

插件 Hub 挂载 `handles.hub`，query 原样交给插件。Workbench 加号只列出 `newTabs`；会话建议走 `workspaces`。点资源一律 Hub：`openResource` 返回 `{ pluginId, location }`。
