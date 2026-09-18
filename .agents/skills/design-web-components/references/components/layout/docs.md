---
title: Layout
description: Handling the overall layout of a page.
---

## When To Use

- Use Layout to compose the top-level page shell with Header, Sider, Content, and Footer. See `demo/basic.md`.
- Use top, side, or top-side demos for common application shells. See `demo/top.md`, `demo/side.md`, `demo/top-side.md`, and `demo/top-side-2.md`.
- Use responsive, fixed header, fixed sider, or custom trigger demos for app navigation behavior. See `demo/responsive.md`, `demo/fixed.md`, `demo/fixed-sider.md`, and `demo/custom-trigger.md`.
- Prefer Grid or Flex inside page content; Layout is for page chrome and navigation structure.

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


### Layout

Common props ref：[Common props](../../docs/vue/common-props.md)

The wrapper.

#### Props 
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasSider | Whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering | boolean | - |

### LayoutSider

#### Props 
The sidebar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| breakpoint | [Breakpoints](../grid/docs.md/#col) of the responsive layout | `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `xxl` \| `xxxl` | - | xxxl: 1.0.3 |
| collapsed | To set the current status | boolean | - |  |
| collapsedWidth | Width of the collapsed sidebar, by setting to 0 a special trigger will appear | number | 80 |  |
| collapsible | Whether can be collapsed | boolean | false |  |
| reverseArrow | Reverse direction of arrow, for a sider that expands from the right | boolean | false |  |
| theme | Color theme of the sidebar | `light` \| `dark` | `dark` |  |
| trigger | Specify the customized trigger, set to null to hide the trigger | ReactNode | - |  |
| width | Width of the sidebar | number \| string | 200 |  |
| zeroWidthTriggerStyle | To customize the styles of the special trigger that appears when `collapsedWidth` is 0 | object | - |  |

#### Events 
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| breakpoint | The callback function, executed when [breakpoints](../grid/docs.md/#api) changed | (broken: boolean) => void | - |
| collapse | The callback function, executed by clicking the trigger or activating the responsive layout | (collapsed: boolean, type: string) => void | - |

## Types

### Breakpoint width

```ts
const breakpointWidth = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
  xxxl: '1920px',
}
```
