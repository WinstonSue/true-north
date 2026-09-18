---
category: Components
group: General
title: EditableText
description: Editable, copyable, and ellipsis-aware text and paragraph components.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- Use EditableText when display text needs inline edit, copy, ellipsis, or suffix behavior. See `demo/basic.md`, `demo/editable.md`, and `demo/copyable.md`.
- Use ellipsis variants for long labels, paths, or identifiers. See `demo/ellipsis.md`, `demo/ellipsis-middle.md`, and `demo/ellipsis-controlled.md`.
- Use title, text, or suffix patterns for richer typography-like text presentation. See `demo/title.md`, `demo/text.md`, and `demo/suffix.md`.
- Prefer Input inside Form when editing is the primary task rather than an inline affordance.

## API

Common props ref: [Common props](/docs/vue/common-props)

### EditableText {#editable-text}

#### Props {#editable-text-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when it is an object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can configure rows, expandable, suffix and callbacks by using object | boolean \| [ellipsis](#ellipsis) | false | - |
| keyboard | Keyboard style | boolean | false | - |
| level | Set heading level. When unset, renders as `span`; when set, renders as `h1` through `h6` | 1 \| 2 \| 3 \| 4 \| 5 \| 6 | - | - |
| mark | Marked style | boolean | false | - |
| strong | Bold style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | EditableTextClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | EditableTextStylesType | - | - |

#### Events {#editable-text-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - |
| copy | Called when copied text | (event: MouseEvent) =&gt; void | - |

### EditableParagraph {#editable-paragraph}

#### Props {#editable-paragraph-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when it is an object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false | - |
| mark | Marked style | boolean | false | - |
| strong | Bold style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | EditableTextClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | EditableTextStylesType | - | - |

#### Events {#editable-paragraph-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - |
| copy | Called when copied text | (event: MouseEvent) =&gt; void | - |

## Types {#types}

### copyable {#copyable}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | The MIME type of the text | 'text/plain' \| 'text/html' | - | - |
| icon | Custom copy icon: \[copyIcon, copiedIcon] | \[VueNode, VueNode] | - | - |
| text | The text to copy | string | - | - |
| tooltips | Custom tooltip text, hide when it is false | \[VueNode, VueNode] | \[`Copy`, `Copied`] | - |
| tabIndex | Set tabIndex of the copy button | number | 0 | - |

### editable {#editable}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoSize | `autoSize` attribute of textarea | boolean \| &#123; minRows: number, maxRows: number &#125; | - | - |
| bordered | Whether the textarea in edit mode has a visible border | boolean | false | - |
| editing | Whether it is editing | boolean | false | - |
| icon | Custom editable icon | VueNode | &lt;Pencil /&gt; | - |
| maxLength | `maxLength` attribute of textarea | number | - | - |
| tooltip | Custom tooltip text, hide when it is false | VueNode | `Edit` | - |
| text | Edit text, specify the editing content instead of using the children implicitly | string | - | - |
| triggerType | Edit mode trigger: icon, text, or both | Array&lt;`icon`\|`text`&gt; | \[`icon`] | - |
| tabIndex | Set tabIndex of the edit button | number | 0 | - |

### ellipsis {#ellipsis}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| expandable | Whether to be expandable | boolean \| 'collapsible' | - | - |
| rows | Max rows of content | number | - | - |
| suffix | Suffix of ellipsis content | string | - | - |
| symbol | Custom description of ellipsis | VueNode \| ((expanded: boolean) =&gt; VueNode) | `Expand` `Collapse` | - |
| tooltip | Show tooltip when ellipsis | VueNode \| [TooltipProps](/components/tooltip/#api) | - | - |
| defaultExpanded | Default expand or collapse | boolean | - | - |
| expanded | Expand or collapse | boolean | - | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="EditableText" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
