---
title: "Pagination"
description: "A long list can be divided into several pages, and only one page will be loaded at a time."
---

## When To Use

- When it will take a long time to load/render all items.
- If you want to browse the data by navigating through pages.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Align | demo/align.md |
| More | demo/more.md |
| Changer | demo/changer.md |
| Jumper | demo/jump.md |
| Size | demo/mini.md |
| Simple mode | demo/simple.md |
| Controlled | demo/controlled.md |
| Total number | demo/total.md |
| Show All | demo/all.md |
| Prev and next | demo/itemRender.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

```jsx
<Pagination onChange={onChange} total={50} />
```

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| align | Align | start \| center \| end | - | 5.19.0 | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| current | Current page number | number | - |  | × |
| defaultCurrent | Default initial page number | number | 1 |  | × |
| defaultPageSize | Default number of data items per page | number | 10 |  | × |
| disabled | Disable pagination | boolean | - |  | × |
| hideOnSinglePage | Whether to hide pager on single page | boolean | false |  | × |
| itemRender | To customize item's innerHTML | (page, type: 'page' \| 'prev' \| 'next', originalElement) => React.ReactNode | - |  | × |
| pageSize | Number of data items per page | number | - |  | × |
| pageSizeOptions | Specify the sizeChanger options | number\[] | \[`10`, `20`, `50`, `100`] |  | × |
| responsive | If `size` is not specified, `Pagination` would resize according to the width of the window | boolean | - |  | × |
| showLessItems | Show less page items | boolean | false |  | × |
| showQuickJumper | Determine whether you can jump to pages directly | boolean \| { goButton: ReactNode } | false |  | × |
| showSizeChanger | Determine whether to show `pageSize` select | boolean \| [SelectProps](../select/docs.md#api) | - | SelectProps: 5.21.0 | 4.21.0, SelectProps: 5.21.0 |
| showTitle | Show page item's title | boolean | true |  | × |
| showTotal | To display the total number and range | function(total, range) | - |  | × |
| simple | Whether to use simple mode | boolean \| { readOnly?: boolean } | - |  | × |
| size | Component size | `large` \| `medium` \| `small` | `medium` |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| total | Total number of data items | number | 0 |  | × |
| totalBoundaryShowSizeChanger | When `total` larger than it, `showSizeChanger` will be true | number | 50 |  | 6.2.0 |
| onChange | Called when the page number or `pageSize` is changed, and it takes the resulting page number and pageSize as its arguments | function(page, pageSize) | - |  | × |
| onShowSizeChange | Called when `pageSize` is changed | function(current, size) | - |  | × |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
