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
| 工作台 | render 聚合页 | 无独立 Entity、Service 或 RouteController | 只组合 Goal、Task、Todo、Habit、TrackTime 数据，不新增服务域。 |
| 目标管理 | `service/growth/goal` | 树、CRUD、关联查询与废弃/恢复路由已存在 | 父子约束、完成入口和删除影响检查见 [Goal](./goal.md)。 |
| 任务管理 | `service/growth/task` | CRUD、树和关联查询基础路由已存在 | 原型详情为抽屉；唯一归属、层级校验和状态转换需收口，见 [Task](./task.md)。 |
| 待办管理 | `service/growth/todo` | 普通/重复待办及批量完成路由已存在 | 原型状态与来源模型和现有枚举存在差异，见 [Todo](./todo.md)。 |
| 习惯管理 | `service/growth/habit` | CRUD 与重复规则校验已存在 | 周期待办编排和产品状态模型仍需对齐，见 [Habit](./habit.md)。 |
| 专注计时 | `service/growth/track-time` | 通用关联时间记录 CRUD 已存在 | 原型全局计时器需要以任务关联和秒级时长接入，见 [TrackTime](./track-time.md)。 |
| 重复规则 | `@true-north/components-repeat` | 规则解析、校验、下一次日期计算已存在 | 不单独暴露 IPC，由 Todo 与 Habit 调用，见 [重复规则](./repeat.md)。 |
