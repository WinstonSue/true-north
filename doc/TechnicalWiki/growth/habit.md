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

桌面端习惯入口为 `/growth/habit/habit-list` 和 `/growth/habit/habit-detail/:id`。列表负责筛选、创建和进入详情；详情负责编辑、暂停/恢复、放弃、删除和当前周期待办打卡。独立习惯统计页已从导航移除，工作台展示连续天数摘要。

| 产品/原型语义 | 当前实现 | 需要明确的边界 |
| --- | --- | --- |
| 状态 | 当前枚举为 `active / paused / completed / abandoned` | render 使用 `HabitStatus` 与服务端保持一致；暂停、激活和放弃均通过受控服务方法完成。 |
| 目标关联 | 习惯 Entity/VO 支持目标关系和筛选 | 创建与更新会校验目标关系；列表筛选和详情展示复用同一 VO。 |
| 重复规则 | 保存和读取都会调用共享规则断言 | 习惯不能使用 `none`，且配置变化必须校验完整规则。 |
| 周期待办 | Habit 返回 `cycleTodoId`，TodoService 负责结算并推进下一周期 | 完成或放弃习惯待办会同步更新习惯统计和下一次日期；暂停、完成或放弃习惯后不再生成新的周期待办。 |

重复规则实现细节见 [重复规则](./repeat.md)。
