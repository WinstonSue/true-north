---
title: "EditableText"
description: "Editable, copyable, and ellipsis-aware text and paragraph components."
---

## When To Use

- When inline text or headings need edit, copy, or ellipsis interactions.
- When paragraph content needs edit, copy, or multi-line ellipsis interactions.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Heading Levels | demo/title.md |
| Text Styles | demo/text.md |
| Editable | demo/editable.md |
| Copyable | demo/copyable.md |
| Ellipsis | demo/ellipsis.md |
| Controlled ellipsis expand/collapse | demo/ellipsis-controlled.md |
| Ellipsis from middle | demo/ellipsis-middle.md |
| Suffix | demo/suffix.md |
|  semantic | demo/_semantic.md |

## API

Common props ref: [Common props](../../docs/react/common-props.md)

### EditableText {#editable-text}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | - |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when it is an object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can configure rows, expandable, suffix and callbacks by using object | boolean \| [ellipsis](#ellipsis) | false | - |
| keyboard | Keyboard style | boolean | false | - |
| level | Set heading level. When unset, renders as `span`; when set to `1`–`5`, renders as `h1`–`h5` | 1 \| 2 \| 3 \| 4 \| 5 \| 6 | - | - |
| mark | Marked style | boolean | false | - |
| strong | Bold style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| onClick | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - | - |

### EditableParagraph {#editable-paragraph}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | - |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when it is an object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false | - |
| mark | Marked style | boolean | false | - |
| strong | Bold style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| onClick | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - | - |

## Types {#types}

### copyable {#copyable}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | The MIME type of the text | 'text/plain' \| 'text/html' | - | - |
| icon | Custom copy icon: \[copyIcon, copiedIcon] | \[ReactNode, ReactNode] | - | - |
| text | The text to copy | string \| (() =&gt; string \| Promise&lt;string&gt;) | - | - |
| tooltips | Custom tooltip text, hide when it is false | \[ReactNode, ReactNode] | \[`Copy`, `Copied`] | - |
| tabIndex | Set tabIndex of the copy button | number | 0 | - |
| onCopy | Called when copied text | (event?: MouseEvent) =&gt; void | - | - |

### editable {#editable}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoSize | `autoSize` attribute of textarea | boolean \| &#123; minRows: number, maxRows: number &#125; | - | - |
| editing | Whether it is editing | boolean | false | - |
| enterIcon | Custom "enter" icon in the edit field (passing `null` removes the icon) | ReactNode | &lt;CornerDownLeft /&gt; | - |
| icon | Custom editable icon | ReactNode | &lt;Pencil /&gt; | - |
| maxLength | `maxLength` attribute of textarea | number | - | - |
| tooltip | Custom tooltip text, hide when it is false | ReactNode | `Edit` | - |
| text | Edit text, specify the editing content instead of using the children implicitly | string | - | - |
| triggerType | Edit mode trigger: icon, text, or both | Array&lt;`icon`\|`text`&gt; | \[`icon`] | - |
| tabIndex | Set tabIndex of the edit button | number | 0 | - |
| onCancel | Called when type ESC to exit editable state | () =&gt; void | - | - |
| onChange | Called when input at textarea | (value: string) =&gt; void | - | - |
| onEnd | Called when type ENTER to exit editable state | () =&gt; void | - | - |
| onStart | Called when enter editable state | () =&gt; void | - | - |

### ellipsis {#ellipsis}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| expandable | Whether to be expandable | boolean \| 'collapsible' | - | - |
| rows | Max rows of content | number | - | - |
| suffix | Suffix of ellipsis content | string | - | - |
| symbol | Custom description of ellipsis | ReactNode \| ((expanded: boolean) =&gt; ReactNode) | `Expand` `Collapse` | - |
| tooltip | Show tooltip when ellipsis | ReactNode \| [TooltipProps](/components/tooltip/#api) | - | - |
| defaultExpanded | Default expand or collapse | boolean | - | - |
| expanded | Expand or collapse | boolean | - | - |
| onEllipsis | Called when enter or leave ellipsis state | (ellipsis: boolean) =&gt; void | - | - |
| onExpand | Called when expand content | (event: MouseEvent, info: &#123; expanded: boolean &#125;) =&gt; void | - | - |

## Semantic DOM {#semantic-dom}

See `demo/_semantic.md`.

## Design Token {#design-token}

See `token.md` for component token definitions.

See [Customize Theme](../../docs/react/customize-theme.md) to learn how to use Design Token.
