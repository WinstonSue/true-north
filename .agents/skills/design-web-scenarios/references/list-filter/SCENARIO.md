# 筛选列表

## 场景来源

- 企业后台最常见的列表工作区：固定筛选/工具条 + 剩余表格区。
- 必须同时处理加载、空数据、请求错误，而不是只画一张表格。

## 业务目标

让用户在确定高度的工作区里筛选、浏览和分页数据。筛选区保持自身高度，主内容区占据剩余空间，状态切换不把整页撑高。

## 场景结构

- 外层 `Flex vertical container="full"`，父级必须有明确高度。
- 固定筛选区：`Form layout="inline"` 或工具条，放在 `container="fixed"`。
- 填充内容区：`Table`、空态、错误提示都发生在 `container="fill"` 内。
- 分页放在填充区内的固定底栏，或由表的 pagination 自行管理，不要制造双滚动。

## 核心交互

- 筛选变化后重置到第一页并重新请求。
- `loading` 时表格显示加载，筛选区保持可编辑，除非请求明确要求锁定。
- 无数据时在填充区展示 `Empty`，可附带清空筛选或新建动作。
- 请求失败时在填充区展示 `Alert`，提供重试，不要用整页 Result 替换当前列表上下文。
- 有数据时展示表格；行状态用 `Tag`，不要手写语义色。

## 状态与数据流

- `filters`：筛选表单值。
- `query`：分页、排序，与筛选一起构成请求参数。
- `loading` / `error` / `rows` / `total`：主内容区异步状态。
- 不要用 `calc(100vh - Npx)` 计算表格高度。

## Sue 组件组合

- `Flex`：`full` / `fixed` / `fill`。
- `Form`、`Form.Item`、`Input`、`Select`、`DatePicker`、`Button`。
- `Table`、`Pagination`、`Empty`、`Spin` 或 `Table.loading`、`Alert`、`Tag`。

## 复用建议

- 布局骨架复用 `layout-flex`。本场景只补筛选、表格和三种异步状态的组合。
- 不要抽不存在的 `FilterBar` / `ProTable` 导入；重复出现时再在宿主项目抽本地 helper。
- Vue recipe 见 `code/list-filter.vue.tsx`，React recipe 见 `code/list-filter.react.tsx`。

## 反模式

- 虚构 `@sue/design-web-scenarios` 的表格容器或筛选条导出。
- 把空态做成全页 Result，导致用户失去筛选上下文。
- 错误时用 `message.error` 一闪而过，填充区仍显示旧数据且不可重试。
- React 任务复制 Vue `.value` 或 `Table full`（若 React 未导出 `full`）。

## 本场景相关 `PATTERNS.md` / `code/` 链接

- `PATTERNS.md`：筛选、请求、空/错/加载态协议。
- `code/list-filter.vue.tsx`：Vue3 TSX 骨架。
- `code/list-filter.react.tsx`：React 骨架。
