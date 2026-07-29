# Todo 技术实现

产品说明见 [待办管理 ProductWiki](../../../apps/prototype/product-wiki/growth/todo/README.md)。

## 代码边界

- 控制器：[todo.route-controller.ts](../../../apps/desktop/src/service/growth/todo/todo.route-controller.ts)，前缀 `/todo`。
- 实例待办与重复待办由控制器按 `TodoRelatedType` 分派到相应服务；实现位于 `apps/desktop/src/service/growth/todo/`。
- DTO 位于 `dto/`，VO 来自 `@true-north/vo` 的 `Todo` 命名空间。

## 已实现路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/todo/create` | 创建普通或重复待办 |
| DELETE | `/todo/delete/:relatedType/:id` | 删除待办或重复模板 |
| PUT | `/todo/update/:relatedType/:id` | 更新待办或重复模板 |
| GET | `/todo/find/:relatedType/:id`、`/list`、`/page` | 查询详情、列表和分页 |
| PUT | `/todo/done/:relatedType/:id`、`/done/batch` | 完成单条或批量完成 |
| PUT | `/todo/abandon/:relatedType/:id`、`/restore/:relatedType/:id` | 废弃与恢复 |

重复待办的具体生成时机由服务实现决定，不在 ProductWiki 中重复描述为接口契约。
