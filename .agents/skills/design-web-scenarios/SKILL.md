---
name: "design-web-scenarios"
description: "使用 @sue/design-web-vue 或 @sue/design-web-react 构建或评审企业后台业务场景的 skill。用于将常见企业后台布局结构、表单流程、筛选列表、异常状态等场景样例，以及通用实现协议，转译为不绑定具体项目路由的 Sue 基础组件组合、状态流和交互结构。"
---

# Sue Design Web 场景实现

这个 skill 是企业场景实现参考。这里的“场景”可以是页面、区域、流程或状态，不要求等同于项目路由；导航入口、菜单层级、访问路径由具体项目决定。

## 框架分流

先锁定宿主唯一组件包，再只使用该框架的 recipe：

- `@sue/design-web-react`：导入 `@sue/design-web-react`，读取 `code/*.react.ts(x)` 和 PATTERNS 中的 React recipe。禁止复制 Vue `.value`、`v-model`、`#slot` 或 `@sue/design-web-vue` 导入。
- `@sue/design-web-vue`：导入 `@sue/design-web-vue`，读取 `code/*.vue.ts(x)` 与 PATTERNS 中的 Vue recipe。

`SCENARIO.md` 只描述业务意图，实现以当前框架的 PATTERNS / `code/` 为准。

## 场景选择规则

先按业务能力选择公开规则名，再在本 skill 内读取对应场景资料；不要在公开规则之外暴露本 skill 的内部资源路径。

| 规则名 | 适用场景 | 先读 |
| --- | --- | --- |
| `layout-flex` | 固定区 + fill 区、固定筛选/工具区 + 剩余内容、抽屉底部固定操作区 | [`references/layout-flex/SCENARIO.md`](references/layout-flex/SCENARIO.md) |
| `list-filter` | 筛选 + 表格 + 空/错/加载态 | [`references/list-filter/SCENARIO.md`](references/list-filter/SCENARIO.md) |
| `form-basic` | 单页字段录入、筛选表单、提交/重置/字段依赖 | [`references/form-basic/SCENARIO.md`](references/form-basic/SCENARIO.md) |
| `form-step` | 多阶段录入、确认页、完成页、步骤生命周期 | [`references/form-step/SCENARIO.md`](references/form-step/SCENARIO.md) |
| `form-advanced` | 密集筛选、可编辑表格、复杂字段联动、错误摘要 | [`references/form-advanced/SCENARIO.md`](references/form-advanced/SCENARIO.md) |
| `result` | 成功、失败、异常、403/404/500、空结果后的动作区 | [`references/result/SCENARIO.md`](references/result/SCENARIO.md) |
| `step` | 流程进度、当前阶段、可跳转状态、紧凑步骤条 | [`references/step/SCENARIO.md`](references/step/SCENARIO.md) |

## 使用流程

1. 先读宿主项目：框架、导航入口、权限、请求封装、状态管理、i18n、图标来源、样式约定、已有布局壳层。
2. 再按业务能力选择“场景选择规则”，优先阅读该规则对应目录的 `SCENARIO.md`。
3. 需要实现协议时，只阅读同一场景目录里的 `PATTERNS.md`；需要代码片段时，只读取同一目录、当前框架的 `code/`。
4. 查基础组件 props、事件、插槽/children、主题 token 时，改用 `design-web-components`，并只打开当前框架的资料树。
5. 遇到固定区 + 剩余内容区时，优先查“Flex 固定区 + 填充区布局”场景；筛选表格再叠加 `list-filter`。
6. 如果 `packages/design-web-scenarios/src` 没有真实导出的场景组件，就在业务实现内组合当前框架的基础组件，不要虚构不存在的表格、表单或页面容器导入。
7. 实现后检查响应式布局、加载/空/错误/权限状态、提交与键盘行为，以及所有导入是否真实存在于当前框架的公开导出。

## 包边界

- 企业后台场景资料提供样例、业务意图、信息架构和交互触发点；它们不是项目访问路径规范。
- 通用实现协议提供抽象：请求协议、schema 渲染、valueType 映射、弹层表单生命周期、步骤流程等。
- `@sue/design-web-vue` 与 `@sue/design-web-react` 提供基础组件：`Card`、`Form`、`Table`、`Modal`、`Drawer`、`Descriptions`、`Statistic`、`Tabs`、`Tag`、`Badge`、`Alert`、`Spin`、`Skeleton`、`Empty`、`Row`、`Col`、`message` 等。
- `@sue/design-web-scenarios` 当前承载 skill、场景元数据和未来场景组件约定；没有实现的组件不要从包里导入。
- 不要把宿主产品的页面壳、插件导航或品牌主题写进本 skill。

## 选型原则

- 先按业务目标选场景，不要先按组件抽象选型。
- 固定工具区/筛选区 + 剩余内容区属于布局场景，优先使用 Sue `Flex` 的 full/fixed/fill 语义表达。
- 同一个业务场景内，可以借鉴通用协议，但实现要落在 Sue 基础组件与宿主项目约定上。
- 只在至少两个业务实现重复出现同一生命周期、状态协议或结构时，再抽本地 helper 或未来场景组件。
- 不要让上游示例名、目录名或访问路径决定宿主项目的信息架构；它们只用于理解场景来源。

## 参考边界

- 场景资料只用于理解业务样例、业务意图和交互结构。
- 协议资料只用于沉淀请求结果、schema 字段、valueType、弹层表单、步骤表单和数据展示联动等思路。

使用这些参考时只继承业务和协议思想；代码实现以当前项目和当前框架的 Sue 基础组件为准。
