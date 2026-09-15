---
name: growth-task-decompose
description: 读取当前任务上下文并生成可采纳的拆解建议。Use when the user wants to break a task into subtasks or todos.
---

# 任务拆解

通过 MCP 工具读写任务：`growth.searchTasks`、`growth.getTask`、`growth.decomposeTask`。

- 拆解必须先 `growth.getTask` 读取上下文与 Constraints/bounds，再调用 `growth.decomposeTask` 并传入生成的 suggestions。
- 子任务与待办的重要度、难度和计划日期不得超过当前任务；省略时继承当前任务。
- 子任务以当前任务为唯一父级，不要再关联目标。
- 不要直接创建任务或待办；创建由用户在工作台采纳完成。
