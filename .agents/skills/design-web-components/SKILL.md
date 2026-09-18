---
name: "design-web-components"
description: "Sue Design Web 组件 API 参考。用于查询 @sue/design-web-vue 或 @sue/design-web-react 组件的 props、events、slots 或 children、方法、示例、组件 Token、全局 ConfigProvider 主题 Token、语义 DOM 说明或具体组件用法。"
---

# Sue Design Web 组件参考

本技能是 Sue Design Web 的离线组件 API 参考，按宿主框架分流。

当任务需要将设计稿映射为 Vue3 TSX 或 React、决定渲染策略，或规划组件／服务／手动实现时，请使用 `design-web-skill`。

语言：en-US

文档和示例已复制至 `references/`，可离线使用。

## 框架分流

先锁定宿主唯一组件包，再只打开对应资料树：

- `@sue/design-web-react`：只读 `references/react/`。组件清单见 `references/react/INDEX.md`。全局 Token 用 `references/react/global-token.md`。禁止打开 Vue 的 `references/components/`、`references/docs/vue/` 或 Vue `demo/*.md`。
- `@sue/design-web-vue`：只读下方 Vue 文档表、`references/components/`、`references/docs/vue/` 和 `references/global-token.md`。禁止打开 `references/react/`。

React 任务不得生成 `@sue/design-web-vue` 导入、`v-model`、`#slot` 或 `<sue-*>` 标签。

## 使用方式

- 从当前框架的统一入口导入可用组件：`@sue/design-web-vue` 或 `@sue/design-web-react`。
- Vue 模板中，全局注册的组件默认使用 `sue-` 标签前缀，例如 `<sue-button>`。React 与 Vue TSX 一律使用具名导入并渲染 `<Button />`。
- 先查看每个组件的 `docs.md`，了解组件选择、`When To Use` 指引、相关组件取舍、props、events、slots/children、方法与示例索引。
- 加载示例前，使用 `docs.md` 中的 `When To Use` 要点选择最相关的示例路径。
- 只有在需要具体用法代码时才查看组件的 `demo/` 目录。`demo/*.md` 是完整示例代码的来源；除小型 API／类型／配置片段外，`docs.md` 有意不包含完整用法示例。
- 只有通过 `ConfigProvider` 配置主题 Token 时，才使用组件 `token.md` 和对应框架的 `global-token.md`。
- 如需服务 API、手动语义概念或设计稿映射例外，请切换至 `design-web-skill`，由该技能选择其策略资源。

## Vue 文档

| 文档                       | 路径                                              |
| -------------------------- | ------------------------------------------------- |
| common-props               | references/docs/vue/common-props.md               |
| compatible-style           | references/docs/vue/compatible-style.md           |
| customize-theme            | references/docs/vue/customize-theme.md            |
| faq                        | references/docs/vue/faq.md                        |
| getting-started            | references/docs/vue/getting-started.md            |
| i18n                       | references/docs/vue/i18n.md                       |
| migration-@sue/design-web-vue | references/docs/vue/migration-@sue/design-web-vue.md |
| nuxt                       | references/docs/vue/nuxt.md                       |
| tailwindcss                | references/docs/vue/tailwindcss.md                |
| unocss                     | references/docs/vue/unocss.md                     |

## AI 结构化参考

| 类型                  | 路径                          | 说明                                                                  |
| --------------------- | ----------------------------- | --------------------------------------------------------------------- |
| 全局 Token Markdown   | references/global-token.md    | `ConfigProvider theme.token` 的全局设计 Token 定义                    |
| 语义 JSON             | references/llms-semantic.json | 从 `_semantic` 示例提取的结构化语义 DOM 描述                         |
| 语义 Markdown         | references/llms-semantic.md   | 便于阅读的语义结构摘要                                                |

## 组件

| 组件            | 文档                                          | 示例                                        | Token                                        | 语义      |
| --------------- | --------------------------------------------- | ------------------------------------------- | -------------------------------------------- | --------- |
| affix           | references/components/affix/docs.md           | references/components/affix/demo/           | references/components/affix/token.md         | 无        |
| alert           | references/components/alert/docs.md           | references/components/alert/demo/           | references/components/alert/token.md         | 1 条 |
| anchor          | references/components/anchor/docs.md          | references/components/anchor/demo/          | references/components/anchor/token.md        | 1 条 |
| app             | references/components/app/docs.md             | references/components/app/demo/             | 无                                           | 无        |
| auto-complete   | references/components/auto-complete/docs.md   | references/components/auto-complete/demo/   | references/components/auto-complete/token.md | 1 条 |
| avatar          | references/components/avatar/docs.md          | references/components/avatar/demo/          | references/components/avatar/token.md        | 无        |
| badge           | references/components/badge/docs.md           | references/components/badge/demo/           | references/components/badge/token.md         | 2 条 |
| border-beamte   | references/components/border-beam/docs.md     | references/components/border-beam/demo/     | 无                                           | 无        |
| breadcrumb      | references/components/breadcrumb/docs.md      | references/components/breadcrumb/demo/      | references/components/breadcrumb/token.md    | 1 条 |
| button          | references/components/button/docs.md          | references/components/button/demo/          | references/components/button/token.md        | 1 条 |
| calendar        | references/components/calendar/docs.md        | references/components/calendar/demo/        | references/components/calendar/token.md      | 1 条 |
| card            | references/components/card/docs.md            | references/components/card/demo/            | references/components/card/token.md          | 1 条 |
| carousel        | references/components/carousel/docs.md        | references/components/carousel/demo/        | references/components/carousel/token.md      | 无        |
| cascader        | references/components/cascader/docs.md        | references/components/cascader/demo/        | references/components/cascader/token.md      | 1 条 |
| checkbox        | references/components/checkbox/docs.md        | references/components/checkbox/demo/        | 无                                           | 1 条      |
| collapse        | references/components/collapse/docs.md        | references/components/collapse/demo/        | references/components/collapse/token.md      | 1 条 |
| color-picker    | references/components/color-picker/docs.md    | references/components/color-picker/demo/    | 无                                           | 1 条      |
| config-provider | references/components/config-provider/docs.md | references/components/config-provider/demo/ | 无                                           | 无        |
| context-menu    | references/components/context-menu/docs.md    | references/components/context-menu/demo/    | references/components/context-menu/token.md  | 1 条 |
| date-picker     | references/components/date-picker/docs.md     | references/components/date-picker/demo/     | references/components/date-picker/token.md   | 1 条 |
| descriptions    | references/components/descriptions/docs.md    | references/components/descriptions/demo/    | references/components/descriptions/token.md  | 1 条 |
| divider         | references/components/divider/docs.md         | references/components/divider/demo/         | references/components/divider/token.md       | 1 条 |
| drawer          | references/components/drawer/docs.md          | references/components/drawer/demo/          | references/components/drawer/token.md        | 1 条 |
| dropdown        | references/components/dropdown/docs.md        | references/components/dropdown/demo/        | references/components/dropdown/token.md      | 1 条 |
| empty           | references/components/empty/docs.md           | references/components/empty/demo/           | 无                                           | 1 条      |
| flex            | references/components/flex/docs.md            | references/components/flex/demo/            | 无                                           | 无        |
| float-button    | references/components/float-button/docs.md    | references/components/float-button/demo/    | 无                                           | 2 条      |
| form            | references/components/form/docs.md            | references/components/form/demo/            | references/components/form/token.md          | 1 条 |
| grid            | references/components/grid/docs.md            | references/components/grid/demo/            | 无                                           | 无        |
| image           | references/components/image/docs.md           | references/components/image/demo/           | references/components/image/token.md         | 1 条 |
| input           | references/components/input/docs.md           | references/components/input/demo/           | references/components/input/token.md         | 5 条 |
| input-number    | references/components/input-number/docs.md    | references/components/input-number/demo/    | references/components/input-number/token.md  | 1 条 |
| layout          | references/components/layout/docs.md          | references/components/layout/demo/          | references/components/layout/token.md        | 无        |
| masonry         | references/components/masonry/docs.md         | references/components/masonry/demo/         | 无 | 1 条 |
| mentions        | references/components/mentions/docs.md        | references/components/mentions/demo/        | references/components/mentions/token.md      | 1 条 |
| menu            | references/components/menu/docs.md            | references/components/menu/demo/            | references/components/menu/token.md          | 1 条 |
| message         | references/components/message/docs.md         | references/components/message/demo/         | references/components/message/token.md       | 1 条 |
| modal           | references/components/modal/docs.md           | references/components/modal/demo/           | references/components/modal/token.md         | 1 条 |
| notification    | references/components/notification/docs.md    | references/components/notification/demo/    | references/components/notification/token.md  | 1 条 |
| overview        | references/components/overview/docs.md        | 无                                          | 无                                           | 无        |
| pagination      | references/components/pagination/docs.md      | references/components/pagination/demo/      | references/components/pagination/token.md    | 1 条 |
| popconfirm      | references/components/popconfirm/docs.md      | references/components/popconfirm/demo/      | references/components/popconfirm/token.md    | 1 条 |
| popover         | references/components/popover/docs.md         | references/components/popover/demo/         | references/components/popover/token.md       | 1 条 |
| progress        | references/components/progress/docs.md        | references/components/progress/demo/        | references/components/progress/token.md      | 1 条 |
| qr-code         | references/components/qr-code/docs.md         | references/components/qr-code/demo/         | 无                                           | 1 条      |
| radio           | references/components/radio/docs.md           | references/components/radio/demo/           | references/components/radio/token.md         | 1 条 |
| rate            | references/components/rate/docs.md            | references/components/rate/demo/            | references/components/rate/token.md          | 无        |
| segmented       | references/components/segmented/docs.md       | references/components/segmented/demo/       | references/components/segmented/token.md     | 1 条 |
| select          | references/components/select/docs.md          | references/components/select/demo/          | references/components/select/token.md        | 1 条 |
| skeleton        | references/components/skeleton/docs.md        | references/components/skeleton/demo/        | references/components/skeleton/token.md      | 2 条 |
| slider          | references/components/slider/docs.md          | references/components/slider/demo/          | references/components/slider/token.md        | 1 条 |
| space           | references/components/space/docs.md           | references/components/space/demo/           | references/components/space/token.md         | 1 条 |
| spin            | references/components/spin/docs.md            | references/components/spin/demo/            | references/components/spin/token.md          | 1 条 |
| splitter        | references/components/splitter/docs.md        | references/components/splitter/demo/        | references/components/splitter/token.md      | 1 条 |
| statistic       | references/components/statistic/docs.md       | references/components/statistic/demo/       | references/components/statistic/token.md     | 1 条 |
| switch          | references/components/switch/docs.md          | references/components/switch/demo/          | references/components/switch/token.md        | 1 条 |
| table           | references/components/table/docs.md           | references/components/table/demo/           | references/components/table/token.md         | 1 条 |
| tabs            | references/components/tabs/docs.md            | references/components/tabs/demo/            | references/components/tabs/token.md          | 1 条 |
| tag             | references/components/tag/docs.md             | references/components/tag/demo/             | references/components/tag/token.md           | 1 条 |
| time-picker     | references/components/time-picker/docs.md     | references/components/time-picker/demo/     | references/components/time-picker/token.md   | 1 条 |
| timeline        | references/components/timeline/docs.md        | references/components/timeline/demo/        | references/components/timeline/token.md      | 1 条 |
| tooltip         | references/components/tooltip/docs.md         | references/components/tooltip/demo/         | references/components/tooltip/token.md       | 1 条 |
| tour            | references/components/tour/docs.md            | references/components/tour/demo/            | references/components/tour/token.md          | 1 条 |
| transfer        | references/components/transfer/docs.md        | references/components/transfer/demo/        | references/components/transfer/token.md      | 1 条 |
| tree            | references/components/tree/docs.md            | references/components/tree/demo/            | references/components/tree/token.md          | 1 条 |
| tree-select     | references/components/tree-select/docs.md     | references/components/tree-select/demo/     | references/components/tree-select/token.md   | 1 条 |
| editable-text   | references/components/editable-text/docs.md   | references/components/editable-text/demo/   | references/components/editable-text/token.md | 1 条 |
| upload          | references/components/upload/docs.md          | references/components/upload/demo/          | references/components/upload/token.md        | 1 条 |
| watermark       | references/components/watermark/docs.md       | references/components/watermark/demo/       | 无                                           | 无        |

## 生成／更新

```bash
pnpm --filter @sue/design-web-skill run skill:generate:react
pnpm --filter @sue/design-web-skill run skill:aggregate
```
