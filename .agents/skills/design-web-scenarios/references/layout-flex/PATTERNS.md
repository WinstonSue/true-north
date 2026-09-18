# Flex 固定区 + 填充区实现协议

## 布局协议

- 父容器必须提供明确高度，例如来自应用布局、抽屉内容区、弹窗 body 或业务容器。
- 外层使用 `Flex vertical container="full"`。
- 固定区使用 `Flex container="fixed"`，承载 filter、search、toolbar、summary 等内容。
- 填充区使用 `Flex container="fill"`，承载 table、list、canvas、detail body、editor 或其他主内容。
- 填充区内部的滚动策略由具体组件决定，但不要让主内容撑破外层工作区。

## TSX recipe

```tsx
<Flex vertical container="full">
  <Flex container="fixed">
    {/* filter / search / toolbar */}
  </Flex>

  <Flex container="fill">
    {/* table / list / content */}
  </Flex>
</Flex>
```

## Vue TSX recipe

Vue 列表把响应式字段留在 `.value` 上。若表格导出 `full`，可让 table body 自己滚动：

```tsx
<Flex vertical container="full">
  <Flex container="fixed">
    <Form layout="inline">{/* filters */}</Form>
  </Flex>

  <Flex vertical container="fill">
    <Table full rowKey="id" loading={loading.value} dataSource={rows.value} />
    <Flex container="fixed">
      <Pagination current={query.current} total={total.value} />
    </Flex>
  </Flex>
</Flex>
```

## React recipe

React 不要使用 Vue `.value`。`Table full` 若未从 `@sue/design-web-react` 导出，就把表格放进 `container="fill"`，用 `scroll.y` 或填充区滚动，不要虚构 `full`。完整片段见 `code/toolbar-fill.react.tsx`。

## 使用前检查

- 外层父节点是否有确定高度。
- 是否真的存在“固定区 + 剩余区”的高度关系。
- 填充区内容是否需要 `min-height: 0` 语义来避免溢出。
- 筛选区高度变化是否仍应保持内容区自动调整。

## Drawer 底部操作区

当设计稿在抽屉**底部**固定操作区、中间内容可滚动时，在 Drawer `#default` 内套用同一套 `full -> fill + fixed` 协议。只约束布局骨架，操作区具体组件按设计稿映射。

```tsx
<Drawer open title="..." closable>
  <Flex vertical container="full">
    <Flex container="fill" style={{ overflow: 'auto', padding: 'var(--yc-padding-lg)' }}>
      {/* scrollable main content */}
    </Flex>
    <Flex container="fixed" justify="flex-end"
      style={{ padding: 'var(--yc-padding) var(--yc-padding-lg)', borderTop: '1px solid var(--yc-color-split)' }}>
      {/* bottom action area — render per design */}
    </Flex>
  </Flex>
</Drawer>
```

注意：

- `#extra` 仅用于 header 角部操作，不要把底部操作区放到 extra。
- Drawer 不支持 `footer` prop/slot。
- 不要用 `paddingBottom` 等 hack 给底部操作区腾空间。
