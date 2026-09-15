---
name: growth-goal-decompose
description: 读取当前目标上下文并生成可采纳的拆解建议。Use when the user wants to break a goal into child goals, tasks, todos, or habits.
---

# 目标拆解

通过 MCP 工具读写目标：`growth.searchGoals`、`growth.getGoal`、`growth.decomposeGoal`。

- 拆解必须先 `growth.getGoal` 读取上下文与 Constraints/bounds，再调用 `growth.decomposeGoal` 并传入生成的 suggestions。
- suggestions 的 importance/difficulty/planned 必须遵守返回的 bounds；省略则继承上级。
- 不要创建目标、任务、待办或习惯；创建由用户在工作台采纳完成。
- 子目标、任务、待办与习惯的重要度、难度不得超过当前目标。
- 计划日期必须落在当前目标的开始/结束范围内。
- 指标目标只能拆出指标子目标；规划目标可拆出规划或指标子目标。
- 习惯建议只能在当前目标处于活跃状态时生成，并关联该目标。
