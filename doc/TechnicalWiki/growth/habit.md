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

| 产品/原型语义 | 当前实现 | 需要明确的边界 |
| --- | --- | --- |
| 状态 | 当前枚举沿用 `todo / doing / done / abandoned` | ProductWiki 使用 `active / paused / completed / abandoned`；未完成枚举迁移前，render 不应把产品状态直接作为 IPC 枚举。 |
| 目标关联 | 习惯 Entity/VO 支持目标关系和筛选 | “至少一个活跃目标”的校验尚需在 Service 层作为业务规则保证。 |
| 重复规则 | 保存和读取都会调用共享规则断言 | 习惯不能使用 `none`，且配置变化必须校验完整规则。 |
| 周期待办 | 当前模块没有单独暴露 `cycleTodo` 领域契约 | “一个活跃习惯对应一个未结算周期待办”的创建、结算和逾期编排需由 Habit 与 Todo 服务协同实现。 |

重复规则实现细节见 [重复规则](./repeat.md)。
