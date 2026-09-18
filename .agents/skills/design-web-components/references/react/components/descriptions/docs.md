---
title: "Descriptions"
description: "Display multiple read-only fields in a group."
---

## When To Use

Commonly displayed on the details page.

```tsx | pure
// works when >= 5.8.0, recommended ✅

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    children: <p>Zhou Maomao</p>,
  },
  {
    key: '2',
    label: 'Telephone',
    children: <p>1810000000</p>,
  },
  {
    key: '3',
    label: 'Live',
    children: <p>Hangzhou, Zhejiang</p>,
  },
  {
    key: '4',
    label: 'Remark',
    children: <p>empty</p>,
  },
  {
    key: '5',
    label: 'Address',
    children: <p>No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</p>,
  },
];

<Descriptions title="User Info" items={items} />;

// works when <5.8.0 , deprecated when >=5.8.0 🙅🏻‍♀️

<Descriptions title="User Info">
  <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
  <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
  <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
  <Descriptions.Item label="Remark">empty</Descriptions.Item>
  <Descriptions.Item label="Address">
    No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
  </Descriptions.Item>
</Descriptions>;
```

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| border | demo/border.md |
| Custom size | demo/size.md |
| responsive | demo/responsive.md |
| Vertical | demo/vertical.md |
| Vertical border | demo/vertical-border.md |
| Custom semantic dom styling | demo/style-class.md |
| row | demo/block.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Descriptions

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| bordered | Whether to display the border | boolean | false |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.23.0 |
| colon | Change default props `colon` value of Descriptions.Item. Indicates whether the colon after the label is displayed | boolean | true |  | × |
| column | The number of `DescriptionItems` in a row, could be an object (like `{ xs: 8, sm: 16, md: 24}`, but must have `bordered={true}`) or a number | number \| [Record<Breakpoint, number>](https://github.com/yuce-design/yuce-design/blob/84ca0d23ae52e4f0940f20b0e22eabe743f90dca/components/descriptions/index.tsx#L111C21-L111C56) | 3 |  | × |
| extra | The action area of the description list, placed at the top-right | ReactNode | - | 4.5.0 | × |
| items | Describe the contents of the list item | [DescriptionsItem](#descriptionitem)[] | - | 5.8.0 | × |
| layout | Define description layout | `horizontal` \| `vertical` | `horizontal` |  | × |
| size | Set the size of the list. Can be set to `medium`,`small`, or not filled | `large` \| `medium` \| `small` | `large` |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.23.0 |
| title | The title of the description list, placed at the top | ReactNode | - |  | × |

### DescriptionItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| label | The description of the content | ReactNode | - |  |
| span | The number of columns included(`filled` Fill the remaining part of the current row) | number \| `filled` \| [Screens](../grid/docs.md#col) | 1 | `screens: 5.9.0`, `filled: 5.22.0` |

> The number of span Description.Item. Span={2} takes up the width of two DescriptionItems. When both `style` and `labelStyle`(or `contentStyle`) configured, both of them will work. And next one will overwrite first when conflict.

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
