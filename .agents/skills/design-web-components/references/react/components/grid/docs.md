---
title: "Grid"
description: "24 Grids System."
---

## Demos

| Demo | Path |
| --- | --- |
| Basic Grid | demo/basic.md |
| Grid Gutter | demo/gutter.md |
| Column offset | demo/offset.md |
| Grid sort | demo/sort.md |
| Typesetting | demo/flex.md |
| Alignment | demo/flex-align.md |
| Order | demo/flex-order.md |
| Flex Stretch | demo/flex-stretch.md |
| Responsive | demo/responsive.md |
| Flex Responsive | demo/responsive-flex.md |
| More responsive | demo/responsive-more.md |
| Playground | demo/playground.md |
| useBreakpoint Hook | demo/useBreakpoint.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

If the Yuce Design grid layout component does not meet your needs, you can use the excellent layout components of the community:

- [react-flexbox-grid](https://roylee0704.github.io/react-flexbox-grid/)
- [react-blocks](https://github.com/whoisandy/react-blocks/)

### Row

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| align | Vertical alignment | `top` \| `middle` \| `bottom` \| `stretch` \| `{[key in 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| 'xxxl']: 'top' \| 'middle' \| 'bottom' \| 'stretch'}` | `top` | object: 4.24.0 | × |
| gutter | Spacing between grids, could be a [string CSS units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units) or a object like { xs: 8, sm: 16, md: 24}. Or you can use array to make horizontal and vertical spacing work at the same time `[horizontal, vertical]` | number \| string \| object \| array | 0 | string: 5.28.0 | × |
| justify | Horizontal arrangement | `start` \| `end` \| `center` \| `space-around` \| `space-between` \| `space-evenly` \| `{[key in 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| 'xxxl']: 'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'}` | `start` | object: 4.24.0 | × |
| wrap | Auto wrap line | boolean | true | 4.8.0 | × |

### Col

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| flex | Flex layout style. Number for 'flex: n n auto', string is applied directly (e.g. pure number string 'n' for 'flex: n 1 0') | string \| number | - |  | × |
| offset | The number of cells to offset Col from the left | number | 0 |  | × |
| order | Raster order | number | 0 |  | × |
| pull | The number of cells that raster is moved to the left | number | 0 |  | × |
| push | The number of cells that raster is moved to the right | number | 0 |  | × |
| span | Raster number of cells to occupy, 0 corresponds to `display: none` | number | none |  | × |
| xs | `screen < 576px` and also default setting, could be a `span` value or an object containing above props | number \| object | - |  | × |
| sm | `screen ≥ 576px`, could be a `span` value or an object containing above props | number \| object | - |  | × |
| md | `screen ≥ 768px`, could be a `span` value or an object containing above props | number \| object | - |  | × |
| lg | `screen ≥ 992px`, could be a `span` value or an object containing above props | number \| object | - |  | × |
| xl | `screen ≥ 1200px`, could be a `span` value or an object containing above props | number \| object | - |  | × |
| xxl | `screen ≥ 1600px`, could be a `span` value or an object containing above props | number \| object | - |  | × |
| xxxl | `screen ≥ 1920px`, could be a `span` value or an object containing above props | number \| object | - | 6.3.0 | × |

You can modify breakpoint values by customizing `screen[XS|SM|MD|LG|XL|XXL|XXXL]` with [theme customization](../../docs/react/customize-theme.md) (since 5.1.0, [sandbox demo](https://codesandbox.io/s/antd-reproduction-template-forked-dlq3r9?file=/index.js)).

The breakpoints of responsive grid follow [BootStrap 4 media queries rules](https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints) (not including `occasionally part`).

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
