# AI 技术域

```yaml
document_meta:
  title: 'AI TechnicalWiki'
  status: 'active'
  last_updated: '2026-09-15'
```

> AI 是宿主平台：负责会话、本机 Agent 运行时、单一聚合 MCP，以及把工作台块交给 Workbench。插件提供 Skills 目录与 MCP `tools/resources/prompts`。产品语义见 ProductWiki。

## 定位与边界

| 负责 | 不负责 |
| --- | --- |
| 会话 / 消息持久化、流式通道、资源附件会话 | Goal/Task/Todo 等业务 CRUD 与校验 |
| 聚合 MCP、Skill 挂载、工具调度 | 读取插件实体目录或理解 `goal/task` |
| 本机编码 Agent 探测、MCP loopback、审计与取消 | 在 `service/ai` 内实现拆解/收集业务逻辑 |
| 通用 workspace 消息块（`workspaceKey: string` + opaque payload） | 工作台 UI、标题、入口文案、自动打开策略 |

依赖方向：插件 MCP/Skill → 宿主聚合 MCP → Agent 运行时 → 通用消息块 → Workbench 端口 → 插件工具 UI。

普通会话输入自动识别记录意图，需要落库时由 Activity 的 `capture_activity` 产出 `activity.capture` workspace。目标/任务拆解由 Growth MCP tools 贡献。**生成**走插件 tool；**采纳**走领域 Service。普通聊天、追问和切换 Agent 不自动打开。

## 文档导航

| 文档 | 说明 |
| --- | --- |
| [platform.md](./platform.md) | 注册表、会话附件、Skill 与聚合 MCP |
| [capabilities.md](./capabilities.md) | Growth MCP 工具与资源 URI |

## 代码落点

```
packages/business/enum/ai/                 # 会话 purpose、错误码、消息角色
packages/business/vo/ai/                   # 通用 Conversation / Message / workspace 协议
apps/desktop/src/service/ai/               # 会话、运行时、聚合 MCP、PluginAiRegistry
apps/desktop/src/render/features/ai/       # 会话壳、workspace host
apps/desktop/src/render/features/workbench/# 通用标签宿主；不 import 业务实现
packages/plugins/growth/src/main/service/ai/  # 拆解 service、MCP tools/resources、Skills
packages/plugins/growth/src/renderer/contributions/ai-decomposition/
apps/desktop/src/service/activity/ai/      # capture 工具
```

分层与 IPC 注册约定参见 [desktop-layers](../architecture/desktop-layers.md)、[plugin-platform](../plugin-platform.md)。

## 扩展原则

1. **插件声明在 manifest**——`ai.skills` 与 `ai.mcp`；实现只提供 local-key 行为。
2. **注册表立即失败**——重复 MCP name、缺失 Skill 目录、missing/extra local key 抛错。
3. **业务实体创建不进 Agent 工具**——生成与采纳分离；创建由用户在工作台确认。
4. **新能力写在插件包**：Skill + MCP tool/resource/prompt + Workbench workspace，由宿主聚合。
5. **REST IPC 承载请求-响应**；流式走独立 preload 通道 `AI_CONVERSATION_STREAM_CHANNEL`。
6. **workspaceKey 由 manifest local key 派生**（如 `growth.goalDecompose`）。
