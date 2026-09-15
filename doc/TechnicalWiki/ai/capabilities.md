# AI Capabilities

```yaml
document_meta:
  status: 'active'
  last_updated: '2026-09-15'
```

产品语义参见 ProductWiki · [目标管理 · AI 拆解](../../../packages/product-wiki/wiki/growth/goal/spec.json)。平台抽象参见 [platform.md](./platform.md)。

Growth 拆解逻辑是插件内部 service，由 namespaced MCP tools `growth.decomposeGoal` / `growth.decomposeTask` 调用。宿主不再提供 Capability HTTP/IPC。

## MCP

| 名称 | 说明 |
| --- | --- |
| `growth.searchGoals` | 只读搜索目标 |
| `growth.searchTasks` | 只读搜索任务 |
| `growth.getGoal` | 读取目标上下文与 bounds |
| `growth.getTask` | 读取任务上下文与 bounds |
| `growth.decomposeGoal` | 把建议写入目标拆解工作台 |
| `growth.decomposeTask` | 把建议写入任务拆解工作台 |

资源模板：`tn://growth/goals/{id}`、`tn://growth/tasks/{id}`。

会话入口：`POST /ai/conversations/resource` `{ uri, label?, skill? }`。

Agent 必须先 get/search 再 decompose。**不在主进程创建** Goal/Task/Todo/Habit；创建由用户在工作台采纳。
