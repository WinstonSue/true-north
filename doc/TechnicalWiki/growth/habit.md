# Habit 技术实现

产品说明见 [习惯管理 ProductWiki](../../../apps/prototype/product-wiki/growth/habit/README.md)。

## 代码边界

- 控制器：[habit.route-controller.ts](../../../apps/desktop/src/service/growth/habit/habit.route-controller.ts)，前缀 `/habit`。
- 服务、DTO 和相关持久化实现位于 `apps/desktop/src/service/growth/habit/`。
- DTO 位于 `dto/`，VO 来自 `@true-north/vo` 的 `Habit` 命名空间。

## 已实现路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/habit/create` | 创建习惯 |
| DELETE | `/habit/delete/:id` | 删除习惯 |
| PUT | `/habit/update/:id` | 更新习惯 |
| GET | `/habit/find/:id`、`/list`、`/page` | 查询单项、列表和分页 |
| PUT | `/habit/abandon/:id`、`/restore/:id` | 废弃与恢复习惯 |
