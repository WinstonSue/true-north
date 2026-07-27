# @sue/design-web-react

公司内部 React 组件源码包，作为 `@sue/design-web-react` 的统一组件库入口维护。

与 Vue 包 [`@sue/design-web-vue`](../design-web-vue) 对齐：同一套公共导出、ConfigProvider、`sue` 前缀与 Ylib 扩展 API。对照矩阵见 [`docs/PARITY.md`](./docs/PARITY.md)。

## 项目定位

- 维护 Ylib Design Web 侧 React 基础组件源码。
- 对外保持统一入口 `@sue/design-web-react`。
- 当前不拆分 `core` / `extended` 子路径。
- 文档与示例见 monorepo 内 [`apps/docs-react`](../../apps/docs-react)（与 Vue 侧 [`apps/docs-vue`](../../apps/docs-vue) 并列）。

## 分层说明

与 Vue 包一致：`core`（高频基础）与 `extended`（低频扩展基础）。分类用于定位与生成侧，不作为导入子路径。

core（高频）：`Button`, `Tooltip`, `Select`, `Radio`, `Input`, `Form`, `Table`, `Checkbox`, `Popover`, `InputNumber`, `Menu`, `Divider`, `Dropdown`, `Switch`, `Tag`, `Col`, `Spin`, `Alert`, `Tabs`, `DatePicker`, `Empty`, `Row`, `Card`, `Tree`。

extended 另含 Ylib 扩展：`EditableText`, `EditableParagraph`, `ButtonGroup.Confirm`, `ButtonLoading`, `BorderBeam`, `Masonry` 等（完整清单以 Vue README / `scripts/parity/vue-value-exports.ts` 为准）。

**不对外导出**（相对上游 antd）：`List`, `Result`, `Steps`, `Typography`, `Grid`（源码可保留；请用 `EditableText` / `Row`+`Col` 等）。

## 样式接入

```ts
import '@sue/design-spec/reset.css'
// zeroRuntime 时额外引入：
import '@sue/design-web-react/dist/sue.css'
```

- `reset` / seed token SSOT：`@sue/design-spec`
- 全量组件 CSS：`pnpm run build:style` → `dist/sue.css`（vitest 抽取；不含 date/time/calendar，因 Node 下 `@rc-component/picker` ESM 限制）
- 不再提供 `dist/reset.css`
- 详见 [docs/style-architecture.md](../../docs/style-architecture.md)

## 常用命令

```bash
pnpm --filter @sue/design-web-react run build
pnpm --filter @sue/design-web-react run build:style
pnpm --filter @sue/design-web-react test
pnpm --filter docs-react dev
```

导出门禁：

```bash
pnpm --filter @sue/design-web-react exec vitest run tests/parity-exports.test.ts
```

## 使用

```tsx
import { Button, ButtonGroup, ConfigProvider, EditableText } from '@sue/design-web-react'
import zhCN from '@sue/design-web-react/locale/zh_CN'

export default () => (
  <ConfigProvider locale={zhCN}>
    <Button type="primary">OK</Button>
    <ButtonGroup.Confirm onConfirm={async () => {}} />
    <EditableText editable>text</EditableText>
  </ConfigProvider>
)
```

默认样式前缀为 `sue`（与 Vue 包 `@sue/design-web-vue` 一致）。
