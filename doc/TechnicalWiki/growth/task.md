# Task 技术实现

产品说明见 [任务管理 ProductWiki](../../../apps/prototype/product-wiki/growth/task/README.md)。

## 代码边界

- 控制器：[task.route-controller.ts](../../../apps/desktop/src/service/growth/task/task.route-controller.ts)，前缀 `/task`。
- 服务、实体关联处理和仓储实现在 `apps/desktop/src/service/growth/task/`。
- DTO 位于该目录的 `dto/`，VO 来自 `@true-north/vo` 的 `Task` 命名空间。

## 已实现路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/task/create` | 创建任务 |
| DELETE | `/task/delete/:id` | 删除任务 |
| PUT | `/task/update/:id` | 更新任务 |
| GET | `/task/find/:id`、`/list`、`/page` | 查询单项、列表和分页 |
| GET | `/task/task-with-relations/:id`、`/tree` | 查询任务及关联信息、任务树 |
| PUT | `/task/abandon/:id`、`/restore/:id` | 废弃与恢复任务 |

路由与返回对象取自当前控制器；更细粒度 DTO/VO 字段请以源码和生成包为准。
