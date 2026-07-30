# 任务管理

<!-- product-wiki:managed:start -->
## 产品规格（受管）

- 标识：`growth.task`
- 类型：module
- 产品状态：路线图
- 原型覆盖：完整覆盖
- 原型入口：`/growth/task`
- 产品定位：承接目标拆解，并向待办和时间追踪下发执行颗粒。
- 依赖：`growth.goal`

### 产品对象

| 对象 | 产品状态 | 原型覆盖 |
| --- | --- | --- |
| 任务 | 路线图 | 完整覆盖 |

### 字段与枚举

| 实体 | 字段 | 类型 | 必填 | 可选值 | 产品状态 | 原型覆盖 | 说明 |
| --- | --- | --- | --- | --- | --- | --- |
| 任务 | `goalId` | reference | 否 |  | 路线图 | 完整覆盖 | 非子任务关联目标。 |
|  | `parentId` | reference | 否 |  | 路线图 | 完整覆盖 | 子任务关联父任务。 |
|  | `status` | enum | 是 | todo / doing / done / abandoned | 路线图 | 完整覆盖 | 任务执行状态。 |
|  | `estimated` | number | 是 |  | 路线图 | 完整覆盖 | 用于排程和时间对比。 |

### 视图矩阵

| 视图 | 原型页 | 场景 | 产品状态 | 原型覆盖 | 产品引用 |
| --- | --- | --- | --- | --- | --- |
| 今日任务 | `task` | 聚焦当日执行与逾期事项 | 路线图 | 部分覆盖 | `growth.task.view.today` |
| 本周任务 | `task` | 分组管理当前周执行 | 路线图 | 部分覆盖 | `growth.task.view.week` |
| 全部任务 | `task` | 全量筛选与治理 | 路线图 | 部分覆盖 | `growth.task.view.all` |
| 任务统计 | `task` | 复盘任务执行状态 | 路线图 | 部分覆盖 | `growth.task.view.statistics` |
| 月度排程 | `task` | 查看任务日期安排 | 路线图 | 部分覆盖 | `growth.task.view.calendar` |
| 任务详情 | `task` | 独立运营任务及其关联对象 | 路线图 | 部分覆盖 | `growth.task.view.detail` |

### 规则索引

| 规则 | 实体 | 说明 | 产品状态 | 原型覆盖 | 产品引用 |
| --- | --- | --- | --- | --- | --- |
| 关联互斥 | task | 任务应关联目标或父任务，避免形成双重上级。 | 路线图 | 部分覆盖 | `growth.task.rule.single-parent` |
| 时间继承 | task | 子任务时间范围受父级目标或任务约束。 | 路线图 | 部分覆盖 | `growth.task.rule.time-inheritance` |

<!-- product-wiki:managed:end -->


<!-- product-ref: growth.task.overview -->
## 目标与价值

任务管理将目标转化为可计划的工作单元。用户借此安排今日和本周工作、查看积压事项，并把完成结果与上层方向连接起来。

<!-- product-ref: growth.task.structure -->
## 业务流程

用户创建任务后选择关联目标或父任务，设置计划时间和优先级，并在执行过程中更新状态。实际开始和结束日期可在编辑时维护；实际耗时由关联任务的专注计时累计。任务可以拆分为子任务；待办和专注时间可围绕任务持续记录，使计划与真实投入保持可追踪。

<!-- product-ref: growth.task.view.today -->
### 今日任务

今日任务按已过期、今日、已完成和已放弃分组，帮助用户集中处理当天需要推进的任务。每项任务可直接完成或打开编辑。

<!-- product-ref: growth.task.view.week -->
### 本周任务

本周任务沿用今日任务的分组结构，展示当前周内需要推进的工作与逾期事项，便于确定每日优先顺序。

<!-- product-ref: growth.task.view.all -->
### 全部任务

全部任务用于搜索、回顾和整理跨周期的任务存量。它需要支持按状态、关联和时间筛选；原型覆盖了主要列表与部分筛选场景。

<!-- product-ref: growth.task.view.statistics -->
### 任务统计

任务统计展示任务总数、完成率、进行中数量和待开始数量，为执行复盘提供状态概览。

<!-- product-ref: growth.task.view.calendar -->
### 月度排程

月度排程以时间维度检查任务分布和期限冲突，帮助用户避免把重要工作集中到同一时段。原型呈现基本排程视图，复杂拖拽调整尚未覆盖。

<!-- product-ref: growth.task.view.detail -->
### 任务详情

任务详情计划汇聚描述、子任务、待办和专注记录，作为单项工作的完整工作台。该产品能力处于路线图阶段，当前原型只覆盖部分编辑操作。

<!-- product-ref: growth.task.interaction -->
## 交互语义

任务的创建、编辑、完成、暂停和恢复都应保留清晰状态。用户在切换状态时应看见关联影响，避免把未完成工作误认为已经结束。

<!-- product-ref: growth.task.rule.single-parent -->
### 关联互斥

一个任务在同一层级只能选择一个直接归属：目标或父任务。该约束保证工作归属可解释，避免重复计入多个方向。

<!-- product-ref: growth.task.rule.time-inheritance -->
### 时间继承

任务的计划时间应位于其归属目标或父任务的时间范围内。没有显式时间时，可采用上级范围作为计划提示，但仍由用户确认具体安排。

## 产品边界

工程实现资料见 [任务管理 TechnicalWiki](../../../../../doc/TechnicalWiki/growth/task.md)。
