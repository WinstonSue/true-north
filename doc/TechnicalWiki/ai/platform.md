# AI Platform

```yaml
document_meta:
  status: 'active'
  last_updated: '2026-09-15'
```

参见 [AI 域总览](./README.md)。通用 Desktop 分层不在此复述。协议细节见 [Plugin Platform](../plugin-platform.md)。

AI 会话与 Workbench 是宿主平台，不是插件。宿主维护单一聚合 MCP（`true_north`）、会话流、审计与取消。插件提供 Skills 目录以及 MCP `tools/resources/prompts`。宿主不读取插件实体目录，也不理解 `goal/task` 业务类型。

## 1. 注册表

- 宿主拥有统一扩展注册表：main 的 `DesktopPluginHost.extensions` 与 renderer 的 `RendererPlatform` registry 是同构、进程内实例，共享 typed extension-point、owner 生命周期和物化 registration。
- 插件贡献（IPC、Activity capture/today、MCP tools/resources/prompts、Skills、agent instructions、composer mentions，以及 renderer 的 catalog/views/workspaces/actions/shell/locales/scopes/openers/host actions）都写入对应进程的 registry。`StorageRegistry` 与 Agent 运行时定义仍独立。
- MCP resource 可声明 `mention`；物化层从同一 resource provider 派生 `ai.composer.mention`。聊天框 `@` 经 IPC `GET /ai/resources/mentions` 查询 main registry。
- 插件内部拆解仍可走插件 service（如 Growth decompose），但只由插件 MCP tool 调用，宿主不再暴露 `/ai/capabilities/*`。
- `AGENTS.md` 只写宿主约束与 Skills 索引；Skill 正文留在 `skills/{pluginId}/{id}/SKILL.md`。

## 2. 会话附件与消息引用

会话保存 `attachments: [{ uri, label?, skill? }]`。插件通过 `host.ai.start` 传入资源 URI。宿主只持久化/转发这些值，打开详情走 `platform.openResource(uri)`。

输入框 `@` 选中的资源写入**当前用户消息**的 `resourceLinks: [{ uri, label }]`，进入 Agent prompt 的名称与 URI；它不改会话级 `attachments`。消息上的资源 chip 同样经 `openResource(uri)` 打开详情。

## 3. 双入口

插件页挂载 `page` 根，query 原样交给插件。Workbench 用 `views` 打开功能标签，snapshot 为 `{ viewId, params }`，同 view 单标签并递增 revision。会话点资源时 `openResource` 给出 `viewId`（工作台）和页内 params。
