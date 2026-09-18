# Workflow 技术域

宿主协调跨插件联动：插件 SQLite 是领域状态唯一权威，宿主只保存 Definition / Association / Plan / Workspace / Outbox / 事件日志 / 冲突工单。不实现跨库事务或 2PC。

三层对象：

- **原语与密封模板**：插件声明 events / commands / interactions / workspaces / templates。模板只能复制为用户 Definition。
- **Definition**：画布与向导共享 `WorkflowDefinitionGraph`。发布冻结版本和 primitive pins。
- **Plan 实例**：关联只存「完成时启动哪份已发布定义」。每次领域事件（如 `growth.todoCompleted`）生成唯一 `(associationId, eventId)` 实例。

回滚必须用户确认，再按发布时的逆拓扑调用 compensate（Expense 为软删除）。冲突停工单，不自动推进。

旧 Activity / Today / Capture 运行时已删除。遗留 `activity` / `activity_link` 表在启动时一次性复制为 `legacy.activity.recorded` 事件。

## 代码落点

```
packages/plugin-contract/src/workflow.ts     # 原语、Definition 图、模板、校验
packages/plugin-sdk/src/host/event-outbox.ts # OutboxRecord / drainOutbox
apps/desktop/src/service/workflow/           # 定义、关联、实例、outbox、回滚、Runner
apps/desktop/src/render/features/workflow/   # 管理页与双编辑器
apps/desktop/skills/conflict-assist/         # 宿主冲突排查 Skill
apps/desktop/src/render/plugin/EventTimeline.tsx
apps/desktop/src/render/plugin/ConflictPanel.tsx
packages/plugin-sdk/src/host/command-ledger.ts
```

## 协议

- 插件声明 `contributions.workflow.{events,commands,interactions,templates}`。
- 命令结果是 `applied | noop | conflict | rejected | notFound | unavailable`。
- 写命令走双层幂等：宿主 `CommandAttempt` + 插件 `PluginCommandLedger`。持久工作区使用 `workspace:{workspaceId}:{pluginId}.{localId}`。
- 领域事件写入 outbox，宿主按关联启动实例；工作区脱离会话持久化，工作台 exactly-once 采纳。
- Growth 不依赖 Expense；待办只存 association，不存账单字段。

## 查询

- `GET /workflow/catalog|definitions|associations|plans|workspaces`
- `POST /workflow/definitions/:id/publish`
- `POST /workflow/plans/:id/rollback`（必须 `confirmed: true`）
- `GET /workflow/events`：带 display snapshot 的只读事件时间线
- `POST /workflow/commands/run`：执行已声明命令
- `POST /workflow/compose`：连接 suggest workspace，不写领域实体
- `GET /workflow/pending`、`POST /workflow/edges/:id/interact`：交互门
- `GET /workflow/conflicts`、`PUT /workflow/conflicts/:id/resolve`：冲突工单
