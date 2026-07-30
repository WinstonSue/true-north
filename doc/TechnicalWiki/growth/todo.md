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

重复待办的具体生成时机由服务实现决定，不在 ProductWiki 中重复描述为接口契约。

## 原型对齐边界

| 产品/原型语义 | 当前实现 | 需要明确的边界 |
| --- | --- | --- |
| 状态 | 原始枚举为 `todo / done / abandoned` | 原型还展示 `in_progress`；在实现前不能假定该值已被服务层接受。 |
| 创建来源 | 枚举为 `manual / repeat / habit / task / is-repeat` | ProductWiki 的独立、目标、任务、习惯来源与当前枚举不是一一对应；来源扩展需要同步 Entity、VO、DTO 和查询。 |
| 计划时间 | Entity/VO 已有 `planDate`、`planStartTime`、`planEndTime` | 计划日与日内时间是当前持久化边界；跨日排程不应由界面私自派生。 |
| 周期待办 | 一个 Repeat 模板由 `TodoRepeatService` 推进并产生日志待办 | 下一次日期与结束条件必须复用共享重复规则，见 [重复规则](./repeat.md)。 |
| 批量完成 | 已有 `/todo/done/batch` | 原型的单次 50 条上限须在 Controller/Service 入参校验处执行。 |

Todo 不在 v0.1.0 新增功能范围；上述差异用于后续接口与原型联调时避免错误假设。
