# Track-Time 技术实现

产品说明见 [专注与时间追踪 ProductWiki](../../../apps/prototype/product-wiki/growth/track-time/README.md)。

## 当前代码边界

- 控制器：[track-time.route-controller.ts](../../../apps/desktop/src/service/growth/track-time/track-time.route-controller.ts)，前缀 `/trackTime`。
- 服务、DTO 和相关持久化实现在 `apps/desktop/src/service/growth/track-time/`。
- DTO 位于 `dto/`，VO 来自 `@true-north/vo` 的 `TrackTime` 命名空间；关联类型来自 `@true-north/enum`。当前模型使用通用 `relatedType / relatedId`，任务是其中一种关联对象。

## 当前 IPC 路由

| 方法 | 路径 | 行为 |
| --- | --- | --- |
| POST | `/trackTime/create` | 创建时间记录 |
| DELETE | `/trackTime/delete/:id` | 删除时间记录 |
| PUT | `/trackTime/update/:id` | 更新时间记录 |
| GET | `/trackTime/find/:id` | 查询时间记录 |
| GET | `/trackTime/related/:relatedType/:relatedId` | 按关联对象查询记录 |
| DELETE | `/trackTime/related/:relatedType/:relatedId` | 删除关联对象的全部记录 |

## 原型对齐边界

| 产品/原型语义 | 当前实现 | 对齐约束 |
| --- | --- | --- |
| 全局计时器 | 原型在顶栏与任务详情中复用 `FocusTimer` | 计时器打开时可携带任务关联；开始、最小化、结束记录的 UI 状态不由 RouteController 保存。 |
| 任务可选关联 | 当前模型支持通用可选关联 | Task 场景使用 `relatedType=task` 与任务 id；未关联记录仍应可创建和查询。 |
| 时长单位 | VO 使用 `duration: number`，旧文档未规定单位 | ProductWiki 与技术边界统一为整数秒；聚合和显示由 render 换算为小时/分钟。 |
| 任务实际耗时 | Task 详情可查询关联记录 | 任务的实际耗时由 TrackTime 记录聚合，不另存可变的 Task 实际时长字段。 |
