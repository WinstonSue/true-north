---
title: "Statistic"
description: "Display statistic number."
---

## When To Use

- When want to highlight some data.
- When want to display statistic data with description.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Unit | demo/unit.md |
| In Card | demo/card.md |
| Timer | demo/timer.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

#### Statistic

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the Statistic component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| decimalSeparator | The decimal separator | string | `.` |  | × |
| formatter | Customize value display logic | (value) => ReactNode | - |  | × |
| groupSeparator | Group separator | string | `,` |  | × |
| loading | Loading status of Statistic | boolean | false | 4.8.0 | × |
| precision | The precision of input value | number | - |  | × |
| prefix | The prefix node of value | ReactNode | - |  | × |
| styles | Customize inline style for each semantic structure inside the Statistic component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| suffix | The suffix node of value | ReactNode | - |  | × |
| title | Display title | ReactNode | - |  | × |
| value | Display value | string \| number | - |  | × |

#### Statistic.Countdown <Badge type="error">Deprecated</Badge>

<Antd component="Alert" title="When using version >= 5.25.0, Please use Statistic.Timer instead." type="warning" banner="true"></Antd>

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | Format as [dayjs](https://day.js.org/) | string | `HH:mm:ss` |  |
| prefix | The prefix node of value | ReactNode | - |  |
| suffix | The suffix node of value | ReactNode | - |  |
| title | Display title | ReactNode | - |  |
| value | Set target countdown time | number | - |  |
| valueStyle | Set value section style | CSSProperties | - |  |
| onFinish | Trigger when time's up | () => void | - |  |
| onChange | Trigger when time's changing | (value: number) => void | - | 4.16.0 |

#### Statistic.Timer <Badge>5.25.0+</Badge>

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Timer direction, count down or count up | `countdown` \| `countup` | - |  |
| format | Format as [dayjs](https://day.js.org/) | string | `HH:mm:ss` |  |
| prefix | The prefix node of value | ReactNode | - |  |
| suffix | The suffix node of value | ReactNode | - |  |
| title | Display title | ReactNode | - |  |
| value | Target time for `countdown`, or start time for `countup` (timestamp in ms) | number | - |  |
| valueStyle | Set value section style | CSSProperties | - |  |
| onFinish | Trigger when time's up, only called when type is `countdown` | () => void | - |  |
| onChange | Trigger when time's changing | (value: number) => void | - |  |

## Semantic DOM

Statistic supports `root`, `header`, `title`, `content`, `value`, `prefix`, and `suffix` semantic DOM nodes.

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
