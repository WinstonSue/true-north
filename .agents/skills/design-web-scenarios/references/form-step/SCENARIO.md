# 分步表单

## 场景来源

- 典型分步表单场景：转账、配置确认、风险操作提交。
- 通用实现协议作为步骤表单生命周期参考。

## 业务目标

把用户不熟悉或风险较高的流程拆成“填写信息、确认信息、完成结果”。每一步都有明确职责，不能只是为了视觉分步而分步。

## 场景结构

- 顶部步骤进度按 `references/step/SCENARIO.md` 的 recipe 生成，不导入已移除的 `Steps` 标准组件。
- 第一步录入核心信息。
- 第二步展示确认信息、风险提示和必要的二次验证字段。
- 第三步按 `result` 场景呈现成功状态，并提供再来一笔、查看详情等动作。

## 核心交互

- 点击下一步前只校验当前步骤相关字段。
- 跨步骤保留已输入值。
- 确认页可以返回上一步修改。
- 最终提交中禁用动作，成功后进入完成页。

## 状态与数据流

- `currentStep`：当前步骤索引。
- `formModel`：一个聚合模型或按步骤拆分的模型。
- `formRefs`：每一步的表单引用。
- `submitting`：最终提交状态。
- `resultData`：成功后的业务摘要。

## Sue 组件组合

- `Form`、`FormItem`、`Select`、`Input`、`InputNumber`。
- 步骤进度区复用 `references/step/SCENARIO.md`：用 `Flex`、`Space`、`Tag`、`Badge`、`Progress`、`Tooltip`、`Button`、本地语义 HTML/CSS 组合表达当前阶段、可跳转状态和错误提示。
- `Descriptions` 展示确认摘要。
- `Alert` 提示风险或规则。
- `Divider`、`Button`、`Space`，完成态结构参考 `references/result/SCENARIO.md`。

## 复用建议

- 多个流程共享“步骤推进、当前步校验、完成重置”时，可复用 `code/use-step-flow.vue.ts` / `code/use-step-flow.react.ts` 的思路。
- 步骤内容保持业务定制，不要把每一步做成复杂通用插槽框架。
- 不允许用户任意点击未来步骤，除非业务允许跳过校验。

## 反模式

- 每一步都提交服务端，导致半成品状态难以恢复。
- 下一步不校验当前表单。
- 完成页没有后续动作。
- 步骤切换时丢失前面输入。

## 本场景相关 `PATTERNS.md` / `code/` 链接

- `PATTERNS.md`：步骤生命周期、确认页和完成页协议。
- `code/use-step-flow.vue.ts`：Vue 步骤推进 composable 骨架。
- `code/use-step-flow.react.ts`：React 步骤推进 hook 骨架。
