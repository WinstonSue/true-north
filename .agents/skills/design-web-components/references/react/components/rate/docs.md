---
title: "Rate"
description: "Used for rating operation on something."
---

## When To Use

- Show evaluation.
- A quick rating operation on something.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Sizes | demo/size.md |
| Half star | demo/half.md |
| Show copywriting | demo/text.md |
| Read only | demo/disabled.md |
| Clear star | demo/clear.md |
| Other Character | demo/character.md |
| Customize character | demo/character-function.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | Whether to allow clear when click again | boolean | true |  | × |
| allowHalf | Whether to allow semi selection | boolean | false |  | × |
| character | The custom character of rate | ReactNode \| (RateProps) => ReactNode | &lt;Star /> | function(): 4.4.0 | × |
| count | Star count | number | 5 |  | × |
| defaultValue | The default value | number | 0 |  | × |
| disabled | If read only, unable to interact | boolean | false |  | × |
| keyboard | Support keyboard operation | boolean | true | 5.18.0 | × |
| size | Star size | 'small' \| 'medium' \| 'large' | 'medium' |  | × |
| tooltips | Customize tooltip by each character | [TooltipProps](../tooltip/docs.md#api)[] \| string\[] | - |  | × |
| value | The current value | number | - |  | × |
| onBlur | Callback when component lose focus | function() | - |  | × |
| onChange | Callback when select value | function(value: number) | - |  | × |
| onFocus | Callback when component get focus | function() | - |  | × |
| onHoverChange | Callback when hover item | function(value: number) | - |  | × |
| onKeyDown | Callback when keydown on component | function(event) | - |  | × |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
