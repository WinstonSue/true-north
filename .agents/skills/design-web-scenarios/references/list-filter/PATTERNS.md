# 筛选 + 表格实现协议

## 布局

先套用 `layout-flex`：父级有高度，外层 `full`，筛选 `fixed`，表格 `fill`。

## 状态机

| 状态 | 填充区 |
| --- | --- |
| `loading && rows.length === 0` | `Spin` 或 `Table loading`，不要用 Empty |
| `error` | `Alert` + 重试按钮，可保留上次成功数据 |
| `!loading && rows.length === 0` | `Empty`，可提供清空筛选 |
| `rows.length > 0` | `Table`，`loading` 仅覆盖表格 |

## 筛选提交

- 查询按钮或字段变更都可以触发请求，但要防抖或在提交时再发。
- 变更筛选时把 `current` 重置为 1。
- 筛选值保持原始类型，展示时再格式化。

## Vue recipe

见 `code/list-filter.vue.tsx`。使用 `ref` / `computed`，表格可使用已导出的 `full`。

## React recipe

见 `code/list-filter.react.tsx`。使用 `useState`、`Form.useForm`、`onFinish`。不要使用 Vue `model` 或 `.value`。React `Table` 未导出 `full` 时，让填充区或 `scroll` 负责滚动。
