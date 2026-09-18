# 基础表单实现协议

## 字段映射

| 字段语义 | Sue 组合 |
| --- | --- |
| 单行文本 | `FormItem` + `Input` |
| 密码文本 | `FormItem` + `InputPassword` |
| 多行文本 | `FormItem` + `TextArea` |
| 数字输入 | `FormItem` + `InputNumber` |
| 选项选择 | `FormItem` + `Select` |
| 单选分组 | `FormItem` + `RadioGroup` |
| 日期范围 | `FormItem` + `DateRangePicker` |

实际组件名以 `design-web-components` 和宿主项目导出为准。

## 依赖字段

Vue 用响应式能力表达依赖字段：

- `computed` 决定字段是否显示。
- `watch` 在上游字段变化时清理下游字段。
- 隐藏字段若不应提交，提交前也要从 payload 中移除或置空。

React 用 `Form.useWatch` 或本地 state 做同样的事：

- 条件渲染决定字段是否显示，不要留下隐藏的 `Form.Item` 脏值。
- 上游 `onValuesChange` 时 `form.setFieldValue` 清理下游字段。
- 不要使用 Vue `computed` / `watch` / `model`。

## 提交生命周期

1. 调用表单校验。Vue 用表单 ref；React 用 `Form.useForm()` 的 `validateFields` 或 `onFinish`。
2. 设置 `submitting = true`。
3. 调用服务，提交原始值。
4. 成功后 message + 按项目约定继续、返回或重置。
5. finally 清理提交状态。

## React recipe

完整受控提交见 `code/basic-form.react.tsx`。要点：`Form.useForm`、`initialValues`、`onFinish`，不要绑定 Vue `model`。
