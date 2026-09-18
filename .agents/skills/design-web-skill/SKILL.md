---
name: "design-web-skill"
description: "Sue Design Web 的 Vue3 TSX 与 React 实现策略。用于基于 @sue/design-web-vue 或 @sue/design-web-react 开发或评审页面、将设计稿语义组件映射为实际导入与渲染策略及 props、slots 或 children、events，或决定使用组件、服务 API 还是手动实现。"
---

# Sue Design Web 实现策略

本技能把 Sue 设计稿语义或产品需求转成宿主框架的实现策略。先锁定唯一组件包，再只读该框架的映射规则与组件资料。

如果任务仅需查询组件 API、示例、插槽/children、事件、方法或主题 Token 表，请使用 `design-web-components`。

## 框架分流

1. 阅读宿主 `package.json` 依赖、现有 import 和布局约定。
2. 锁定唯一 `importSource`：
   - 宿主使用 `@sue/design-web-react` → `target: react`，读取 `references/skill-assets/web-mapping-rules.react.ts`。
   - 宿主使用 `@sue/design-web-vue` → `target: vue3-tsx`，读取 `references/skill-assets/web-mapping-rules.ts`。
3. 禁止混用：React 任务不得生成 `@sue/design-web-vue` 导入、`v-model`、`#slot`、`<sue-*>` 或 Vue SFC。Vue 任务不得生成 `@sue/design-web-react` 导入或 React hooks 示例。

## 策略选择规则

使用以下公开规则选择后续参考来源，不要暴露其他技能的内置资源路径：

- `semantic-mapping`：处理设计语义／规格映射、导入策略、props／events／slots 或 children 映射，或组件／服务／手动渲染决策时，使用本技能，并按需读取本技能的策略资源。
- `component-api-lookup`：需要精确的组件 API、示例、语义 DOM、插槽/children、事件、方法或 Token 表时，切换至 `design-web-components`；该技能按框架维护参考资料。
- `scenario-pattern`：处理固定／填充布局、表单流程、筛选列表、结果状态或步骤流等企业页面场景时，切换至 `design-web-scenarios` 并使用其公开的场景规则名。
- 不要在本技能中写入其他技能的 `references/`、`scripts/` 或其他内置资源路径。

## 工作流程

1. 先阅读宿主项目：框架约定、路由／布局外壳、数据获取、状态管理、国际化、图标、样式，以及现有的 `@sue/design-web-vue` 或 `@sue/design-web-react` 用法。
2. 将设计稿交互语义映射为代码前，先读取当前框架的 mapping rules。组件导入名、渲染策略、props、slots/children 和 events 映射均以它为准。
3. 识别控件的交互语义，并在编写交互标记前对照映射规则。不要将 Figma 图层名或组件名作为组件选型依据，也不要仅因选项动态生成便改用原生按钮。
4. 使用规则中的 `renderStrategy` 选择实现方式：
   - `component`：从当前 `importSource` 导入具名导出并渲染为 TSX。
   - `service`：调用 `message`、`notification` 等服务 API；不要把它们渲染为 JSX 组件。
   - `manual`：通过项目代码、原生元素或认可的本地辅助工具实现该语义；不要虚构不存在的导出。
5. 为常见交互控件选择 `manual` 前，先查阅对应的 `design-web-components` 文档和示例。说明组件不匹配或能力缺失的原因；动态数据、筛选和受控状态本身不足以作为理由。
6. 需要精确的 props、events、slots/children、方法、示例、语义 DOM 或 Token 表时，切换至 `design-web-components`，并且只读取当前框架、当前任务所需的组件文件。
7. 实现后，确认每个导入都存在于当前框架的公开导出，服务 API 以调用方式使用而非渲染，手动概念具备明确的本地实现和例外记录，并保留宿主项目的布局与无障碍约定。

## 控件映射约束

| 交互语义 | 默认实现 | 实现前检查 |
| --- | --- | --- |
| 在同一上下文中导航不同内容面板 | `Tabs` | 阅读当前框架的 Tabs 文档／示例，确认受控 `activeKey`、动态 `items` 和额外内容的用法。 |
| 在同一内容中切换紧凑的互斥模式、视图或筛选条件 | `Segmented` | 阅读当前框架的 Segmented 文档／示例，确认受控 `value` 和动态 `options` 的用法。 |

将其视为默认映射，而非视觉建议。仅在记录了匹配组件无法满足所需行为或无障碍要求的原因后，才允许使用原生按钮组。

## 职责边界

- `design-web-skill` 负责前端实现策略与设计稿到 Vue3 TSX 或 React 的映射。
- `design-web-components` 负责离线组件 API 参考、示例、组件 Token、全局 Token 与语义 DOM 摘要。
- `design-web-scenarios` 负责企业业务页面场景与可复用流程模式。
- `design-ui-skill` 负责 Figma／设计产出策略；不要将其 Figma 渲染规则当作前端实现规则。
- 不要把宿主产品的页面壳、插件导航或品牌主题决策写进本技能。

## 策略资源

| 资源 | 用途 |
| --- | --- |
| `references/skill-assets/web-mapping-rules.ts` | 设计稿 `componentType` 到 Vue3 TSX 导入／渲染／props／slots／events 的规则 |
| `references/skill-assets/web-mapping-rules.react.ts` | 设计稿 `componentType` 到 React 导入／渲染／props／children／events 的规则 |
| `references/skill-assets/types.ts` | 用于维护策略的规则类型定义 |
| `references/skill-assets/index.ts` | 导出的策略资源入口 |

## 维护

- 当某个语义组件新增、移除或变更实际 Vue 实现策略时，更新 `references/skill-assets/web-mapping-rules.ts`。
- 当某个语义组件新增、移除或变更实际 React 实现策略时，更新 `references/skill-assets/web-mapping-rules.react.ts`。
- 策略变更后运行 `pnpm --filter @sue/design-web-skill run skill:validate`。
- 打包或安装技能前运行 `pnpm --filter @sue/design-web-skill run skill:aggregate`。
