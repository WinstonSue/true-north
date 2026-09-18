---
title: "Table"
description: "A table displays rows of data."
---

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| selection | demo/row-selection.md |
| Selection and operation | demo/row-selection-and-operation.md |
| Custom selection | demo/row-selection-custom.md |
| Filter and sorter | demo/head.md |
| Filter in Tree | demo/filter-in-tree.md |
| Filter search | demo/filter-search.md |
| Multiple sorter | demo/multiple-sorter.md |
| Reset filters and sorters | demo/reset-filter.md |
| Customized filter panel | demo/custom-filter-panel.md |
| Ajax | demo/ajax.md |
| size | demo/size.md |
| border, title and footer | demo/bordered.md |
| Expandable Row | demo/expand.md |
| Order Specific Column | demo/order-column.md |
| colSpan and rowSpan | demo/colspan-rowspan.md |
| Tree data | demo/tree-data.md |
| Fixed Header | demo/fixed-header.md |
| Fixed Columns | demo/fixed-columns.md |
| Stack Fixed Columns | demo/fixed-gapped-columns.md |
| Fixed Columns and Header | demo/fixed-columns-header.md |
| Hidden Columns | demo/hidden-columns.md |
| Grouping table head | demo/grouping-columns.md |
| Editable Cells | demo/edit-cell.md |
| Editable Rows | demo/edit-row.md |
| Nested tables | demo/nested-table.md |
| Drag sorting | demo/drag-sorting.md |
| Drag sorting with handler | demo/drag-sorting-handler.md |
| ellipsis column | demo/ellipsis.md |
| ellipsis column custom tooltip | demo/ellipsis-custom-tooltip.md |
| Custom empty | demo/custom-empty.md |
| Summary | demo/summary.md |
| Virtual list | demo/virtual-list.md |
| Responsive | demo/responsive.md |
| Pagination Settings | demo/pagination.md |
| Fixed header and scroll bar with the page | demo/sticky.md |
| Dynamic Settings | demo/dynamic-settings.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Table

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| bordered | Whether to show all table borders | boolean | false |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.1 |
| column | Shared props applied to columns when the same property is not defined on the column itself | Partial<[ColumnType](#column)> | - | 6.4.0 | × |
| columns | Columns of table | [ColumnsType](#column)\[] | - |  | × |
| components | Override default table elements | [TableComponents](https://github.com/react-component/table/blob/75ee0064e54a4b3215694505870c9d6c817e9e4a/src/interface.ts#L129) | - |  | × |
| dataSource | Data record array to be displayed | object\[] | - |  | × |
| expandable | Config expandable content | [expandable](#expandable) | - |  | `expandable.expandIcon`: 5.14.0 |
| footer | Table footer renderer | function(currentPageData) | - |  | × |
| getPopupContainer | The render container of dropdowns in table | (triggerNode) => HTMLElement | () => TableHtmlElement |  | × |
| loading | Loading status of table | boolean \| [Spin Props](/components/spin/#api) | false |  | × |
| locale | The i18n text including filter, sort, empty text, etc | object | [Default Value](https://github.com/yuce-design/yuce-design/blob/6dae4a7e18ad1ba193aedd5ab6867e1d823e2aa4/components/locale/en_US.tsx#L19-L37) |  | × |
| pagination | Config of pagination. You can ref table pagination [config](#pagination) or full [`pagination`](/components/pagination/) document, hide it by setting it to `false` | object \| `false` | - |  | × |
| rowClassName | Row's className | function(record, index): string | - |  | × |
| rowKey | Row's unique key, could be a string or function that returns a string | string \| function(record): string | `key` |  | `string`: 6.0.0, `function`: 6.1.0 |
| rowSelection | Row selection [config](#rowselection) | object | - |  | × |
| rowHoverable | Row hover | boolean | true | 5.16.0 | × |
| scroll | Whether the table can be scrollable, [config](#scroll) | object | - |  | 6.3.0 |
| showHeader | Whether to show table header | boolean | true |  | × |
| showSorterTooltip | The header show next sorter direction tooltip. It will be set as the property of Tooltip if its type is object | boolean \| [Tooltip props](/components/tooltip/#api) & `{target?: 'full-header' \| 'sorter-icon' }` | { target: 'full-header' } | 5.16.0 | × |
| size | Size of table | `large` \| `medium` \| `small` | `large` |  | × |
| sortDirections | Supported sort way, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] |  | × |
| sticky | Set sticky header and scroll bar | boolean \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - | 4.6.0 (getContainer: 4.7.0) | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.1 |
| summary | Summary content | (currentData) => ReactNode | - |  | × |
| tableLayout | The [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) attribute of table element | - \| `auto` \| `fixed` | -<hr />`fixed` when header/columns are fixed, or using `column.ellipsis` |  | × |
| title | Table title renderer | function(currentPageData) | - |  | × |
| virtual | Support virtual list | boolean | - | 5.9.0 | × |
| onChange | Callback executed when pagination, filters or sorter is changed | function(pagination, filters, sorter, extra: { currentDataSource: \[], action: `paginate` \| `sort` \| `filter` }) | - |  | × |
| onHeaderRow | Set props on per header row | function(columns, index) | - |  | × |
| onRow | Set props on per row | function(record, index) | - |  | × |
| onScroll | Triggered when the table body is scrolled. Note that only vertical scrolling will trigger the event when `virtual` | function(event) | - | 5.16.0 | × |

### Table ref

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| nativeElement | The wrap element | HTMLDivElement | 5.11.0 |
| scrollTo | Trigger to scroll to target position. `key` match with record `rowKey`. When `offset` is specified, the table will scroll to align the target row to the top with the given offset and not working with `top`. Optional `align` param to control alignment: `start` align to top, `center` align to center, `end` align to bottom, `nearest` smart align (default). `center` align is not supported in virtual scrolling mode | (config: { index?: number, key?: React.Key, top?: number, offset?: number, align?: 'start' \| 'center' \| 'end' \| 'nearest' }) => void | 5.11.0 |

#### onRow usage

Same as `onRow` `onHeaderRow` `onCell` `onHeaderCell`

```jsx
<Table
  onRow={(record, rowIndex) => {
    return {
      onClick: (event) => {}, // click row
      onDoubleClick: (event) => {}, // double click row
      onContextMenu: (event) => {}, // right button click row
      onMouseEnter: (event) => {}, // mouse enter row
      onMouseLeave: (event) => {}, // mouse leave row
    };
  }}
  onHeaderRow={(columns, index) => {
    return {
      onClick: () => {}, // click header row
    };
  }}
/>
```

### Column

One of the Table `columns` prop for describing the table's columns, Column has the same API.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | The specify which way that column is aligned | `left` \| `right` \| `center` | `left` |  |
| className | The className of this column | string | - |  |
| colSpan | Span of this column's title | number | - |  |
| dataIndex | Display field of the data record, support nest path by string array | string \| string\[] | - |  |
| defaultFilteredValue | Default filtered values | string\[] | - |  |
| filterResetToDefaultFilteredValue | click the reset button, whether to restore the default filter | boolean | false |  |
| defaultSortOrder | Default order of sorted values | `ascend` \| `descend` | - |  |
| ellipsis | The ellipsis cell content, not working with sorter and filters for now.<br />tableLayout would be `fixed` when `ellipsis` is `true` or `{ showTitle?: boolean }` | boolean \| {showTitle?: boolean } | false | showTitle: 4.3.0 |
| filterDropdown | Customized filter overlay | ReactNode \| (props: [FilterDropdownProps](https://github.com/yuce-design/yuce-design/blob/ecc54dda839619e921c0ace530408871f0281c2a/components/table/interface.tsx#L79)) => ReactNode | - |  |
| filtered | Whether the `dataSource` is filtered | boolean | false |  |
| filteredValue | Controlled filtered value, filter icon will highlight | string\[] | - |  |
| filterIcon | Customized filter icon | ReactNode \| (filtered: boolean) => ReactNode | - |  |
| filterOnClose | Whether to trigger filter when the filter menu closes | boolean | true | 5.15.0 |
| filterMultiple | Whether multiple filters can be selected | boolean | true |  |
| filterMode | To specify the filter interface | 'menu' \| 'tree' | 'menu' | 4.17.0 |
| filterSearch | Whether to be searchable for filter menu | boolean \| function(input, record):boolean | false | boolean:4.17.0 function:4.19.0 |
| filters | Filter menu config | object\[] | - |  |
| filterDropdownProps | Customized dropdown props, `filterDropdownOpen` and `onFilterDropdownOpenChange` were available before `<5.22.0` | [DropdownProps](../dropdown/docs.md#api) | - | 5.22.0 |
| fixed | (IE not support) Set column to be fixed: `true`(same as `'start'`) `'start'` `'end'` | boolean \| string | false |  |
| key | Unique key of this column, you can ignore this prop if you've set a unique `dataIndex` | string | - |  |
| render | Renderer of the table cell. `value` is the value of current cell; `record` is the value object of current row; `index` is the row number. The return value should be a ReactNode | (value: V, record: T, index: number): ReactNode | - |  |
| responsive | The list of breakpoints at which to display this column. Always visible if not set | [Breakpoint](https://github.com/yuce-design/yuce-design/blob/015109b42b85c63146371b4e32b883cf97b088e8/components/_util/responsiveObserve.ts#L1)\[] | - | 4.2.0 |
| rowScope | Set scope attribute for all cells in this column | `row` \| `rowgroup` | - | 5.1.0 |
| shouldCellUpdate | Control cell render logic | (record, prevRecord) => boolean | - | 4.3.0 |
| showSorterTooltip | If header show next sorter direction tooltip, override `showSorterTooltip` in table | boolean \| [Tooltip props](/components/tooltip/) & `{target?: 'full-header' \| 'sorter-icon' }` | { target: 'full-header' } | 5.16.0 |
| sortDirections | Supported sort way, override `sortDirections` in `Table`, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] |  |
| sorter | Sort function for local sort, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction. If it is server-side sorting, set to `true`, but if you want to support multi-column sorting, you can set it to `{ multiple: number }` | function \| boolean \| { compare: function, multiple: number } | - |  |
| sortOrder | Order of sorted values: `ascend` `descend` `null` | `ascend` \| `descend` \| null | - |  |
| sortIcon | Customized sort icon | (props: { sortOrder }) => ReactNode | - | 5.6.0 |
| title | Title of this column | ReactNode \| ({ sortColumns, filters }) => ReactNode | - |  |
| width | Width of this column ([width not working?](https://github.com/yuce-design/yuce-design/issues/13825#issuecomment-449889241)) | string \| number | - |  |
| minWidth | Min width of this column, only works when `tableLayout="auto"` | number | - | 5.21.0 |
| hidden | Hidden this column | boolean | false | 5.13.0 |
| onCell | Set props on per cell | function(record, rowIndex) | - |  |
| onFilter | Function that determines if the row is displayed when filtered | function(value, record) => boolean | - |  |
| onHeaderCell | Set props on per header cell | function(column) | - |  |

### ColumnGroup

| Property | Description               | Type      | Default |
| -------- | ------------------------- | --------- | ------- |
| title    | Title of the column group | ReactNode | -       |

### pagination

Properties for pagination.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Specify the placement of `Pagination`, could be`topStart` \| `topCenter` \| `topEnd` \|`bottomStart` \| `bottomCenter` \| `bottomEnd` \| `none` | Array | \[`bottomEnd`] |

More about pagination, please check [`Pagination`](/components/pagination/).

### expandable

Properties for expandable.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| childrenColumnName | The column contains children to display | string | children |  |
| columnTitle | Set the title of the expand column | ReactNode | - | 4.23.0 |
| columnWidth | Set the width of the expand column | string \| number | - |  |
| defaultExpandAllRows | Expand all rows initially | boolean | false |  |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - |  |
| expandedRowClassName | Expanded row's className | string \| (record, index, indent) => string | - | string: 5.22.0 |
| expandedRowKeys | Current expanded row keys | string\[] | - |  |
| expandedRowRender | Expanded container render for each row | function(record, index, indent, expanded): ReactNode | - |  |
| expandIcon | Customize row expand Icon. Ref [example](https://codesandbox.io/s/fervent-bird-nuzpr) | function(props): ReactNode | - |  |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | false |  |
| fixed | Whether the expansion icon is fixed. Optional true `left` `right` | boolean \| string | false | 4.16.0 |
| indentSize | Indent size in pixels of tree data | number | 15 |  |
| rowExpandable | Enable row can be expandable | (record) => boolean | - |  |
| showExpandColumn | Show expand column | boolean | true | 4.18.0 |
| onExpand | Callback executed when the row expand icon is clicked | function(expanded, record) | - |  |
| onExpandedRowsChange | Callback executed when the expanded rows change | function(expandedRows) | - |  |

### rowSelection

Properties for row selection.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Set the alignment of selection column | `left` \| `right` \| `center` | `left` | 5.25.0 |
| checkStrictly | Check table row precisely; parent row and children rows are not associated | boolean | true | 4.4.0 |
| columnTitle | Set the title of the selection column | ReactNode \| (originalNode: ReactNode) => ReactNode | - |  |
| columnWidth | Set the width of the selection column | string \| number | `32px` |  |
| fixed | Fixed selection column on the left | boolean | - |  |
| getCheckboxProps | Get Checkbox or Radio props | function(record) | - |  |
| getTitleCheckboxProps | Get title Checkbox props | function() | - |  |
| hideSelectAll | Hide the selectAll checkbox and custom selection | boolean | false | 4.3.0 |
| preserveSelectedRowKeys | Keep selection `key` even when it removed from `dataSource` | boolean | - | 4.4.0 |
| renderCell | Renderer of the table cell. Same as `render` in column | (checked: boolean, record: T, index: number, originNode: ReactNode): ReactNode | - | 4.1.0 |
| selectedRowKeys | Controlled selected row keys | string\[] \| number\[] | \[] |  |
| defaultSelectedRowKeys | Default selected row keys | string\[] \| number\[] | \[] |  |
| selections | Custom selection [config](#selection), only displays default selections when set to `true` | object\[] \| boolean | - |  |
| type | `checkbox` or `radio` | `checkbox` \| `radio` | `checkbox` |  |
| onCell | Set props on per cell. Same as `onCell` in column | function(record, rowIndex) | - | 5.5.0 |
| onChange | Callback executed when selected rows change | function(selectedRowKeys, selectedRows, info: { type }) | - | `info.type`: 4.21.0 |
| onSelect | Callback executed when select/deselect one row | function(record, selected, selectedRows, nativeEvent) | - |  |

### scroll

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | Whether to scroll to the top of the table when paging, sorting, filtering changes | boolean | - |
| x | Set horizontal scrolling, can also be used to specify the width of the scroll area, could be number, percent value, true and ['max-content'](https://developer.mozilla.org/en-US/docs/Web/CSS/width#max-content) | string \| number \| true | - |
| y | Set vertical scrolling, can also be used to specify the height of the scroll area, could be string or number | string \| number | - |

### selection

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | ReactNode | - |
| onSelect | Callback executed when this selection is clicked | function(changeableRowKeys) | - |

## Using in TypeScript {#using-in-typescript}

```tsx
import React from 'react';
import { Table } from '@sue/design-web-react';
import type { TableColumnsType } from '@sue/design-web-react';

interface User {
  key: number;
  name: string;
}

const columns: TableColumnsType<User> = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
  },
];

const data: User[] = [
  {
    key: 0,
    name: 'Jack',
  },
];

const Demo: React.FC = () => (
  <>
    <Table<User> columns={columns} dataSource={data} />
    {/* JSX style usage */}
    <Table<User> dataSource={data}>
      <Table.Column<User> key="name" title="Name" dataIndex="name" />
    </Table>
  </>
);

export default Demo;
```

Here is the [CodeSandbox for TypeScript](https://codesandbox.io/s/serene-platform-0jo5t).

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## Note

According to the [React documentation](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key), every child in an array should be assigned a unique key. The values inside the Table's `dataSource` and `columns` should follow this rule. By default, `dataSource[i].key` will be treated as the key value for `dataSource`.

![console warning](https://os.alipayobjects.com/rmsportal/luLdLvhPOiRpyss.png)

If `dataSource[i].key` is not provided, then you should specify the primary key of dataSource value via `rowKey`, as shown below. If not, warnings like the one above will show in browser console.

```jsx
// primary key is uid
return <Table rowKey="uid" />;
// or
return <Table rowKey={(record) => record.uid} />;
```

## FAQ

### How to hide pagination when single page or no data? {#faq-hide-pagination}

You can set `hideOnSinglePage` with `pagination` prop.

### Table will return to first page when filter data. {#faq-filter-to-first-page}

Table total page count usually reduce after filter data, we by default return to first page in case of current page is out of filtered results.

You may need to keep current page after filtering when fetch data from remote service, please check [this demo](https://codesandbox.io/s/yuanchengjiazaishuju-yuce-design-demo-7y2uf) as workaround.

Also you can use the action from extra param to determine when return to first page.

### Why Table pagination show size changer? {#faq-size-changer}

In order to improve user experience, Pagination show size changer by default when `total > 50` since `4.1.0`. You can set `showSizeChanger=false` to disable this feature.

### Why Table fully render when state change? {#faq-state-update-rerender}

Table can not tell what state used in `columns.render`, so it always need fully render to avoid sync issue. You can use `column.shouldCellUpdate` to control render.

### How should I troubleshoot Table performance issues? {#faq-table-performance}

React DevTools may add extra overhead when profiling complex tables, especially with many rows or cells. If you notice obvious lag, please try disabling React DevTools or testing in a clean browser environment first. If the performance issue can still be reproduced in a normal runtime, feel free to provide a minimal reproduction so we can continue to investigate.

### How to handle fixed column display over the mask layout? {#faq-fixed-column-zindex}

Fixed column use `z-index` to make it over other columns. You will find sometimes fixed columns also over your mask layout. You can set `z-index` on your mask layout to resolve.

### How to custom render Table Checkbox（For example, adding Tooltip）? {#faq-custom-checkbox-render}

Since `4.1.0`, You can use [`rowSelection.renderCell`](https://ant.design/components/table/#rowselection) to custom render Table Checkbox. If you want to add Tooltip, please refer to this [demo](https://codesandbox.io/s/table-row-tooltip-v79j2v).

### Why does components.body.wrapper or components.body.row report an error when virtual is enabled? {#faq-virtual-wrapper-ref}

Because virtual table needs to get its ref to do some calculations, so you need to use `React.forwardRef` wrapper and pass the ref to the dom. Like this:

```tsx
const EditableRow = React.forwardRef<HTMLTableRowElement, EditableRowProps>(
  ({ index, ...props }, ref) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} ref={ref} />
        </EditableContext.Provider>
      </Form>
    );
  },
);
```

For scenarios with fixed row heights and vertical scrolling, you can use the following method:

```tsx
<Table
  //@ts-ignore // This property is not exported, but it can be passed through to the internal virtual scrolling
  listItemHeight={36} // This helps virtual scrolling calculate the height correctly, with each row fixed at 36px
/>
```
