# Goal 技术实现

产品说明见 [目标管理 ProductWiki](../../../apps/prototype/product-wiki/growth/goal/README.md)。

## 代码边界

- 控制器：[goal.route-controller.ts](../../../apps/desktop/src/service/growth/goal/goal.route-controller.ts)，前缀 `/goal`。
- 服务与仓储实现位于 `apps/desktop/src/service/growth/goal/`；控制器通过 `GoalService` 调用业务能力。
- DTO 位于同目录 `dto/`，VO 来自 `@true-north/vo` 的 `Goal` 命名空间。

## 已实现路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/goal/create` | 创建目标 |
| DELETE | `/goal/delete/:id` | 删除目标 |
| PUT | `/goal/update/:id` | 更新目标 |
| GET | `/goal/find/:id`、`/list`、`/page` | 查询单项、列表和分页 |
| GET | `/goal/get-tree`、`/find-roots`、`/children/:parentId` | 查询目标树与层级节点 |
| PUT | `/goal/abandon/:id`、`/restore/:id` | 废弃与恢复目标 |

控制器负责将请求 VO 导入 DTO，再调用服务并导出 VO；本文不将其视为产品字段契约。
