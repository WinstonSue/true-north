# Track-Time 技术实现

产品说明见 [专注与时间追踪 ProductWiki](../../../apps/prototype/product-wiki/growth/track-time/README.md)。

## 代码边界

- 控制器：[track-time.route-controller.ts](../../../apps/desktop/src/service/growth/track-time/track-time.route-controller.ts)，前缀 `/trackTime`。
- 服务、DTO 和相关持久化实现在 `apps/desktop/src/service/growth/track-time/`。
- DTO 位于 `dto/`，VO 来自 `@true-north/vo` 的 `TrackTime` 命名空间；关联类型来自 `@true-north/enum`。

## 已实现路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/trackTime/create` | 创建时间记录 |
| DELETE | `/trackTime/delete/:id` | 删除时间记录 |
| PUT | `/trackTime/update/:id` | 更新时间记录 |
| GET | `/trackTime/find/:id` | 查询时间记录 |
| GET | `/trackTime/related/:relatedType/:relatedId` | 按关联对象查询记录 |
| DELETE | `/trackTime/related/:relatedType/:relatedId` | 删除关联对象的全部记录 |
