# Todo 技术实现

产品说明见 [待办管理 ProductWiki](../../../apps/prototype/product-wiki/growth/todo/README.md)。

## 当前代码边界

- 控制器：[todo.route-controller.ts](../../../apps/desktop/src/service/growth/todo/todo.route-controller.ts)，前缀 `/todo`。
- 实例待办与重复待办由控制器按 `TodoRelatedType` 分派到相应服务；普通待办由 `TodoService` 处理，模板和下一实例由 `TodoRepeatService` 处理。
- DTO 位于 `dto/`，VO 来自 `@true-north/vo` 的 `Todo` 命名空间。

## 当前 IPC 路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/todo/create` | 创建普通或重复待办 |
| DELETE | `/todo/delete/:relatedType/:id` | 删除待办或重复模板 |
| PUT | `/todo/update/:relatedType/:id` | 更新待办或重复模板 |
| GET | `/todo/find/:relatedType/:id`、`/list`、`/page` | 查询详情、列表和分页 |
| PUT | `/todo/done/:relatedType/:id`、`/done/batch` | 完成单条或批量完成 |
| PUT | `/todo/abandon/:relatedType/:id`、`/restore/:relatedType/:id` | 废弃与恢复 |

重复待办的具体生成时机由服务实现决定，不在 ProductWiki 中重复描述为接口契约。不提供 `/todo/start`、`/todo/pause`。

## 原型对齐边界

桌面端增长待办入口为 `/growth/todo/todo-today`、`/growth/todo/todo-calendar` 和 `/growth/todo/todo-all`；`todo-today` 是当前日期工作清单，左侧日程日历可切换选定日期，列表按「已过期 / **未完成** / 已完成 / 已放弃」分组（仅选定今天时显示已过期）。**能力集以 Desktop 为准，页面视觉对齐 Prototype。** 批量完成仅在 `todo-all`（单次 ≤50）；当前页不提供多选批量。独立周视图和统计页已移除，工作台承担聚合统计。

| 产品/原型语义 | 当前实现 | 需要明确的边界 |
| --- | --- | --- |
| 状态 | 枚举为 `todo / done / abandoned` | 无 `in_progress`；完成、放弃和恢复必须走受控接口；通用 update 不接受状态流转。历史 `in_progress` 迁移为 `todo`。列表直接露出完成与放弃。 |
| 创建来源 | 枚举为 `none / goal / habit / task / repeat / is-repeat` | 手动创建禁止写入任务或习惯来源；系统生成待办保留唯一来源，重复模板实例使用 `is-repeat`，历史完成记录使用 `repeat`。 |
| 计划时间 | Entity/VO 已有 `planDate`、`planStartTime`、`planEndTime` | 起止相等为时间点；不相等为区间。跨日排程不应由界面私自派生。 |
| 标签 | 无标签字段 | 待办不提供标签能力。 |
| 专注关联 | 区间 + 未完成待办可打开全局计时器并预关联 `relatedType=todo` | 时间点待办隐藏入口；已有 TrackTime 记录只读展示；结束计时不改待办状态。 |
| 周期待办 | 一个 Repeat 模板由 `TodoRepeatService` 推进并产生日志待办 | 新建可开关键复；编辑不可切换是否重复，已启用时可调规则细节。见 [重复规则](./repeat.md)。 |
| 批量完成 | 已有 `/todo/done/batch` | 仅全部待办页暴露；Service 已校验单次最多 50 条，并逐条结算以保证习惯周期可以推进。 |
| 当前页列表 | TodoAgendaSections + TodoItem | overdue 仅今天；execution row：checkbox+完成，习惯/周期行内未完成；区间待办可开始专注；放弃/删除可留菜单。 |
| 月历 chip | CalendarCell | 左边框风格对齐原型；悬停新建逻辑保持。 |

原型与桌面端目前共享当前/日历/全部三类入口；ProductWiki 中保留的周视图和统计视图属于后续规划，不应作为当前路由或接口验收项。
