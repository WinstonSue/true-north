# Workflow 技术域

宿主协调跨插件联动：插件 SQLite 是领域状态唯一权威，宿主只保存 Plan / Edge / Attempt / 事件日志 / 冲突工单。不实现跨库事务或 2PC。

旧 Activity / Today / Capture 运行时已删除。遗留 `activity` / `activity_link` 表在启动时一次性复制为 `legacy.activity.recorded` 事件，原表保留回滚但不被运行时访问。

## 代码落点

```
packages/plugin-contract/src/workflow.ts     # 事件/命令/交互声明、CommandResult、ResourceRef
apps/desktop/src/service/workflow/           # Plan、Runner、事件日志、冲突工单、迁移
apps/desktop/skills/conflict-assist/         # 宿主冲突排查 Skill
apps/desktop/src/render/plugin/EventTimeline.tsx
apps/desktop/src/render/plugin/ConflictPanel.tsx
packages/plugin-sdk/src/host/command-ledger.ts
```

## 协议

- 插件声明 `contributions.workflow.{events,commands,interactions}`，实现 `handles.workflow.commands` / `handles.workflow.interactions`。
- 命令结果是 `applied | noop | conflict | rejected | notFound | unavailable`，业务冲突不得伪装成异常。
- 写命令走双层幂等：宿主 `CommandAttempt` + 插件 `PluginCommandLedger`。建议工作台使用 `workspace:{workspaceId}:{pluginId}.{localId}`。成功（applied/noop）后同一 key 配不同输入直接拒绝；校验失败或暂时不可用可修正后重试。
- Edge：`armed → awaiting_interaction → dispatching → succeeded`，以及 `conflict` / `retryable_error` / `blocked_plugin` / `failed_terminal` / `cancelled` / `expired`。
- 只自动重试瞬时错误和插件暂不可用。revision 冲突、校验拒绝、资源不存在停止并开冲突工单。
- Agent 首次规划只能调用各插件 suggest MCP 与宿主 `workflow.compose`；确认后退出状态机。冲突排查走 `workflow.conflictAssist` Skill：只能读资源和调用 `workflow.proposeConflictResolution`。工单身份、允许动作和 revision 由运行时强制校验。

## 查询

- `GET /workflow/events`：带 display snapshot 的只读事件时间线
- `POST /workflow/commands/run`：执行已声明命令
- `POST /workflow/compose`：连接 suggest workspace，不写领域实体
- `GET /workflow/pending`、`POST /workflow/edges/:id/interact`：交互门
- `GET /workflow/conflicts`、`PUT /workflow/conflicts/:id/resolve`：冲突工单
