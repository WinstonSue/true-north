# Goal 技术实现

产品说明见 [目标管理 ProductWiki](../../../apps/prototype/product-wiki/growth/goal/README.md)。

## 当前代码边界

- 控制器：[goal.route-controller.ts](../../../apps/desktop/src/service/growth/goal/goal.route-controller.ts)，前缀 `/goal`。
- 服务与仓储实现位于 `apps/desktop/src/service/growth/goal/`；控制器通过 `GoalService` 调用业务能力。
- DTO 位于同目录 `dto/`，VO 来自 `@true-north/vo` 的 `Goal` 命名空间；Entity 使用 TypeORM closure table 保存父子层级。

## 当前 IPC 路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/goal/create` | 创建目标 |
| DELETE | `/goal/delete/:id` | 删除目标 |
| PUT | `/goal/update/:id` | 更新目标 |
| GET | `/goal/find/:id`、`/list`、`/page` | 查询单项、列表和分页 |
| GET | `/goal/get-tree`、`/find-roots`、`/children/:parentId` | 查询目标树与层级节点 |
| PUT | `/goal/abandon/:id`、`/restore/:id` | 废弃与恢复目标 |

控制器负责将请求 VO 导入 DTO，再调用服务并导出 VO；本文不将其视为产品字段契约。

## 原型对齐边界

| 原型契约 | 当前情况 | 对齐落点 |
| --- | --- | --- |
| `vision / result` 类型 | 现有枚举为 `objective / key_result` | 在 enum、VO、DTO、Entity 和数据库迁移中统一，并通过生成流程更新调用端。 |
| 父子类型、时间、重要度和难度约束 | Entity 有相关字段，但 GoalService 未集中验证 | 创建与更新时查询直接父级/子级，由 Service 在事务内拒绝越界。 |
| 完成、放弃、恢复 | 有 abandon/restore；`done` Service 方法未暴露为 RouteController | 使用独立状态路由处理状态和时间戳，渲染层保持状态 Tag 只读。 |
| 删除影响提示 | 当前删除直接交给 Repository | Service 汇总子目标、任务、待办和习惯；存在影响时拒绝删除并返回摘要。 |

版本内设计、接口新增和验收见 [v0.1.0 TDD](../../v0.1.0/TDD.md)。
