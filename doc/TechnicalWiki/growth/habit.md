# Habit 技术实现

产品说明见 [习惯管理 ProductWiki](../../../apps/prototype/product-wiki/growth/habit/README.md)。

## 当前代码边界

- 控制器：[habit.route-controller.ts](../../../apps/desktop/src/service/growth/habit/habit.route-controller.ts)，前缀 `/habit`。
- 服务、DTO 和相关持久化实现位于 `apps/desktop/src/service/growth/habit/`；`HabitService` 在创建、更新、读取时通过 `@true-north/components-repeat` 校验重复配置。
- DTO 位于 `dto/`，VO 来自 `@true-north/vo` 的 `Habit` 命名空间。

## 当前 IPC 路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/habit/create` | 创建习惯 |
| DELETE | `/habit/delete/:id` | 删除习惯 |
| PUT | `/habit/update/:id` | 更新习惯 |
| GET | `/habit/find/:id`、`/list`、`/page` | 查询单项、列表和分页 |
| PUT | `/habit/abandon/:id`、`/restore/:id` | 废弃与恢复习惯 |

## 原型对齐边界

功能与样式真源均为 **Prototype**：主路径是列表/卡片就地打卡（完成 / 未完成），不必先进入详情。Desktop 路由 `/growth/habit/habit-list` 与 `/growth/habit/habit-detail/:id` 可保留，详情降为次要入口（编辑规则、暂停/恢复、放弃等）。工作台习惯区复用同一套 Todo 结算接口完成就地打卡。

| 产品/原型语义 | 当前实现 | 对齐方案 |
| --- | --- | --- |
| HabitCard 字段 | 卡片含打卡 | 标题、目标、`执行规则：{label}`、连续 Progress、完成/未完成/编辑；弱化难度/重要度堆砌。`formatHabitRepeatLabel` 映射 repeatMode/end。 |
| 工作台习惯行 | 就地打卡 | meta=`规则 · 连续 N 天 · 目标`；完成/未完成调用 Todo done/abandon。 |
| 列表就地打卡 | HabitCard footer | `cycleTodoId` 存在时完成/未完成；刷新习惯列表。 |
| 详情 | `/habit-detail/:id` | 次要入口：编辑规则、暂停/恢复、放弃、删除。 |
| 状态 | `active / paused / completed / abandoned` | 不变；受控服务方法。 |
| 周期待办 | `cycleTodoId` + TodoService | 不变；见 [重复规则](./repeat.md)。 |

不做数据迁移；本地测试数据可保留。
