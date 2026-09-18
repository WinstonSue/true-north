---
title: "Layout"
description: "Handling the overall layout of a page."
---

## Demos

| Demo | Path |
| --- | --- |
| Basic Structure | demo/basic.md |
| Header-Content-Footer | demo/top.md |
| Header-Sider | demo/top-side.md |
| Header Sider 2 | demo/top-side-2.md |
| Sider | demo/side.md |
| Custom trigger | demo/custom-trigger.md |
| Responsive | demo/responsive.md |
| Fixed Header | demo/fixed.md |
| Fixed Sider | demo/fixed-sider.md |

## API

```jsx
<Layout>
  <Header>header</Header>
  <Layout>
    <Sider>left sidebar</Sider>
    <Content>main content</Content>
    <Sider>right sidebar</Sider>
  </Layout>
  <Footer>footer</Footer>
</Layout>
```

### Layout

Common props ref：[Common props](../../docs/react/common-props.md)

The wrapper.

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| hasSider | Whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering | boolean | - |  | × |

### Layout.Sider

The sidebar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| breakpoint | [Breakpoints](/components/grid/#col) of the responsive layout | `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `xxl` \| `xxxl` | - | xxxl: 6.3.0 |
| classNames | Customize class for each semantic structure inside the Sider component, supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  |
| collapsed | To set the current status | boolean | - |  |
| collapsedWidth | Width of the collapsed sidebar, by setting to 0 a special trigger will appear | number | 80 |  |
| collapsible | Whether can be collapsed | boolean | false |  |
| defaultCollapsed | To set the initial status | boolean | false |  |
| reverseArrow | Reverse direction of arrow, for a sider that expands from the right | boolean | false |  |
| styles | Customize inline style for each semantic structure inside the Sider component, supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| theme | Color theme of the sidebar | `light` \| `dark` | `dark` |  |
| trigger | Specify the customized trigger, set to null to hide the trigger | ReactNode | - |  |
| width | Width of the sidebar | number \| string | 200 |  |
| zeroWidthTriggerStyle | To customize the styles of the special trigger that appears when `collapsedWidth` is 0 | object | - |  |
| onBreakpoint | The callback function, executed when [breakpoints](/components/grid/#api) changed | (broken) => {} | - |  |
| onCollapse | The callback function, executed by clicking the trigger or activating the responsive layout | (collapsed, type) => {} | - |  |

## Semantic DOM

#### breakpoint width

```js
{
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
  xxxl: '1920px',
}
```

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
