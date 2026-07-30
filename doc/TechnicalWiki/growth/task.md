# Task 技术实现

产品说明见 [任务管理 ProductWiki](../../../apps/prototype/product-wiki/growth/task/README.md)。

## 当前代码边界

- 控制器：[task.route-controller.ts](../../../apps/desktop/src/service/growth/task/task.route-controller.ts)，前缀 `/task`。
- 服务、实体关联处理和仓储实现在 `apps/desktop/src/service/growth/task/`；Entity 使用 TypeORM closure table 保存父子任务。
- DTO 位于该目录的 `dto/`，VO 来自 `@true-north/vo` 的 `Task` 命名空间。

## 当前 IPC 路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/task/create` | 创建任务 |
| DELETE | `/task/delete/:id` | 删除任务 |
| PUT | `/task/update/:id` | 更新任务 |
| GET | `/task/find/:id`、`/list`、`/page` | 查询单项、列表和分页 |
| GET | `/task/task-with-relations/:id`、`/tree` | 查询任务及关联信息、任务树 |
| PUT | `/task/abandon/:id`、`/restore/:id` | 废弃与恢复任务 |

`/task/tree` 返回根节点及嵌套 `children`；`/task/task-with-relations/:id` 是详情聚合入口。路由与返回对象取自当前控制器；更细粒度 DTO/VO 字段请以源码和生成包为准。

## 原型对齐边界

| 原型契约 | 当前情况 | 对齐落点 |
| --- | --- | --- |
| 详情抽屉 | 原型在 `pages/task-detail/` 使用当前根任务子树 | Desktop render 在任务页内挂载抽屉，不新增独立任务详情路由。 |
| 详情数据 | 有树和任务关联查询基础接口 | 树定位当前根任务；Todo 按 `taskIds` 查询；TrackTime 按 `relatedType/relatedId` 查询。 |
| 唯一直接归属 | `goalId`、`parentId` 都可为空或同时设置 | Create/Update Service 强制二选一，并校验归属对象和无循环层级。 |
| 时间、重要度、难度继承 | 当前模型缺少难度，未统一校验 | Task 使用上游目标或父任务作为约束源；所有写入入口在 Service 校验。 |
| 删除与状态流转 | 删除逻辑会处理后代/待办，通用 update 可改状态 | 改为关联子任务或 Todo 时拒绝删除；完成、放弃、恢复使用受控状态入口。 |
| 工时 | `estimateTime` 为字符串 | `estimated` 与 TrackTime `duration` 均以整数秒为边界契约，展示层换算小时/分钟。 |

版本内设计、迁移和验收见 [v0.1.0 TDD](../../v0.1.0/TDD.md)。
