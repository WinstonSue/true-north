# 分步表单实现协议

## 步骤推进

- `currentStep` 只由 `next`、`prev`、`reset` 修改。
- `next` 先校验当前步骤表单。
- 最终提交成功后进入完成步骤，不要立即跳走，除非业务明确要求。

## 确认页

确认页使用 `Descriptions` 展示关键字段，配合 `Alert` 解释风险、手续费、不可撤销等信息。

## 表单模型

简单流程可使用一个聚合模型；复杂流程可按步骤拆 model，但最终提交前在 service 边界组装 payload。

Vue 使用 `code/use-step-flow.vue.ts`（`ref`）。React 使用 `code/use-step-flow.react.ts`（`useState`），并在 `next` 前调用当前步骤 `form.validateFields()`。

## 禁止跳步

除非业务允许，否则按 `references/step/SCENARIO.md` 生成的步骤进度只作为进度展示，不要让用户点击未来步骤绕过校验。
