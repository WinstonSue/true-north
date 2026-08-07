# Growth 技术实现

本目录记录 Growth 域的桌面端技术基线。产品语义、规则和路线图以 [Growth ProductWiki](../../../apps/prototype/product-wiki/growth/README.md) 为准；每个模块页区分“当前实现”和“原型对齐缺口”，避免把设计目标误写为已实现能力。

- [目标管理](./goal.md)
- [任务管理](./task.md)
- [待办管理](./todo.md)
- [习惯管理](./habit.md)
- [专注与时间追踪](./track-time.md)
- [重复规则](./repeat.md)

带有 RouteController 的 Growth 模块路由由 desktop 的 `electron-ipc-restful` 承载；路径以控制器前缀和方法路径组合表示。共享重复规则不单独暴露 IPC。

## 原型覆盖与技术归属

| 原型能力 | 技术归属 | 当前基线 | 对齐说明 |
| --- | --- | --- | --- |
| 工作台 | render 聚合页 | 已组合目标、任务、待办、习惯和专注投入指标 | 只组合各域数据，不新增服务域。 |
| 目标管理 | `service/growth/goal` | 树、CRUD、关联查询、AI 拆解和受控状态流转已存在 | 父子约束、完成入口和删除影响检查见 [Goal](./goal.md)。 |
| 任务管理 | `service/growth/task` | 当前任务、月历、全部任务和详情抽屉已接入 | 当前任务与原型都使用可切换日期；独立周视图和统计页已从桌面导航移除，见 [Task](./task.md)。 |
| 待办管理 | `service/growth/todo` | 当前待办、月历、全部待办、批量完成和重复/习惯联动已接入 | 当前待办与原型都使用可切换日期；独立周视图和统计页已从桌面导航移除，见 [Todo](./todo.md)。 |
| 习惯管理 | `service/growth/habit` | 列表、详情、创建/编辑、暂停/恢复、放弃和周期待办打卡已存在 | 习惯状态和重复规则通过业务服务统一处理，见 [Habit](./habit.md)。 |
| 专注计时 | `service/growth/track-time` | 全局覆盖层、任务入口和秒级关联时间记录已接入 | 任务场景使用 `relatedType=task` 与任务 id；未关联记录仍可创建和查询，见 [TrackTime](./track-time.md)。 |
| 重复规则 | `@true-north/components-repeat` | 规则解析、校验、下一次日期计算已存在 | 不单独暴露 IPC，由 Todo 与 Habit 调用，见 [重复规则](./repeat.md)。 |
