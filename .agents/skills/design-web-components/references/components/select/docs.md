---
title: Select
description: A dropdown menu for displaying choices.
---

## When To Use

- Use Select when users choose one or more values from a predefined option list. See `demo/basic.md` and `demo/multiple.md`.
- Use search, custom filtering, sorting, or remote-like user search when options are many. See `demo/search.md`, `demo/search-filter-option.md`, `demo/search-sorts.md`, and `demo/search-users.md`.
- Use tags, tokenization, labelInValue, maxCount, or custom tag/label render for multi-value workflows. See `demo/tags.md`, `demo/automatic-tokenization.md`, `demo/label-in-value.md`, `demo/maxCount.md`, `demo/custom-tag-render.md`, and `demo/custom-label-render.md`.
- Use option groups, option render, custom dropdown, or big data demos for advanced lists. See `demo/optgroup.md`, `demo/option-render.md`, `demo/custom-dropdown-menu.md`, and `demo/big-data.md`.
- Prefer Radio for fewer than five visible options and AutoComplete when typed free text is allowed.

## Demos

<!-- prettier-ignore -->

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Select with search field | demo/search.md |
| Custom Search | demo/search-filter-option.md |
| Multiple selection | demo/multiple.md |
| Sizes | demo/size.md |
| Custom dropdown options | demo/option-render.md |
| Search with sort | demo/search-sorts.md |
| Tags | demo/tags.md |
| Option Group | demo/optgroup.md |
| Coordinate | demo/coordinate.md |
| Search Box | demo/search-box.md |
| Get value of selected item | demo/label-in-value.md |
| Automatic tokenization | demo/automatic-tokenization.md |
| Search and Select Users | demo/search-users.md |
| Prefix and Suffix | demo/suffix.md |
| Custom dropdown | demo/custom-dropdown-menu.md |
| Hide Already Selected | demo/hide-selected.md |
| Variants | demo/variant.md |
| Custom Tag Render | demo/custom-tag-render.md |
| Custom Selected Label Render | demo/custom-label-render.md |
| Responsive maxTagCount | demo/responsive.md |
| Big Data | demo/big-data.md |
| Status | demo/status.md |
| Placement | demo/placement.md |
| Max Count | demo/maxCount.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Property 
Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| &#123; clearIcon?: VueNode &#125; | false | - |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags` | boolean | true | - |
| defaultActiveFirstOption | Whether active first option by default | boolean | true | - |
| disabled | Whether disabled select | boolean | false | - |
| fieldNames | Customize node label, value, options, groupLabel field name | object | &#123; label: 'label', value: 'value', options: 'options', groupLabel: 'label' &#125; | - |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| (inputValue: string, option?: Option) =&gt; boolean | true | - |
| filterSort | Sort function for search options sorting, see Array.sort's compareFunction | (optionA: Option, optionB: Option, info: &#123; searchValue: string &#125;) =&gt; number | - | - |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to body. When position issues happen, try to modify it into scrollable content and position it relative | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| labelInValue | Whether to embed label in value, turn the format of value from `string` to `&#123; value: string, label: VueNode &#125;` | boolean | false | - |
| listHeight | Config popup height | number | 256 | - |
| loading | Indicate loading state | boolean | false | - |
| maxCount | The max number of items can be selected, only applies when `mode` is `multiple` or `tags` | number | - | - |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number \| 'responsive' | - | - |
| maxTagPlaceholder | Placeholder for not showing tags | VueNode \| (omittedValues: LabeledValue[]) =&gt; VueNode | - | - |
| maxTagTextLength | Max tag text length to show | number | - | - |
| menuItemSelectedIcon | The custom menuItemSelected icon with multiple options | VueNode | - | - |
| mode | Set mode of Select | 'multiple' \| 'tags' | - | - |
| notFoundContent | Specify content to show when no result matches | VueNode | `Not Found` | - |
| open | Controlled open state of dropdown | boolean | - | - |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label. When a string[] is provided, multiple fields are searched using OR matching | string \| string[] | value | - |
| options | Select options. Will get better perf than jsx definition | &#123; label: VueNode; value: string &#125;[] | - | - |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData&lt;BaseOptionType&gt;, info: &#123; index: number &#125;) =&gt; VueNode | - | - |
| placeholder | The placeholder of select | string | - | - |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | - |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | - |
| popupRender | Customize dropdown content | (originNode: VueNode) =&gt; VueNode | - | - |
| prefix | The custom prefix | VueNode | - | - |
| removeIcon | The custom remove icon | VueNode | - | - |
| searchValue | The current input "search" text | string | - | - |
| showSearch | Whether select is searchable | boolean \| Object | single: false, multiple: true | - |
| size | Size of Select input | `large` \| `medium` \| `small` | - | - |
| status | Set validation status | 'error' \| 'warning' | - | - |
| suffixIcon | The custom suffix icon. Customize icon will not response click open to avoid icon designed to do other interactive. You can use `pointer-events: none` style to bypass | VueNode | `<ChevronDown />` | - |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | (props) =&gt; VueNode | - | - |
| labelRender | Customize selected label render | (props: LabelInValueType) =&gt; VueNode | - | - |
| tokenSeparators | Separator used to tokenize, only applies when `mode="tags"` | string[] | - | - |
| value | Current selected option (considered as a immutable array), support `v-model:value` | string \| string[] \| number \| number[] | - | - |
| variant | Variants of selector | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |
| virtual | Disable virtual scroll when set to false | boolean | true | - |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| active | Called when keyboard or mouse interaction occurs | (value: string \| number) =&gt; void | - |
| blur | Called when blur | (event: FocusEvent) =&gt; void | - |
| change | Called when select an option or input value change | (value, option: Option \| Array&lt;Option&gt;) =&gt; void | - |
| clear | Called when clear | () =&gt; void | - |
| deselect | Called when an option is deselected, param is the selected option's value. Only called for `multiple` or `tags`, effective in multiple or tags mode only | (value: string \| number) =&gt; void | - |
| focus | Called when focus | (event: FocusEvent) =&gt; void | - |
| inputKeydown | Called when key pressed | (event: KeyboardEvent) =&gt; void | - |
| openChange | Called when dropdown open | (open: boolean) =&gt; void | - |
| popupScroll | Called when dropdown scrolls | (event: UIEvent) =&gt; void | - |
| search | Callback function that is fired when input changed | (value: string) =&gt; void | - |
| select | Called when an option is selected, the params are option's value (or key) and option instance | (value: string \| number, option: Option) =&gt; void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| labelRender | Customize selected label render | (props: LabelInValueType) =&gt; VueNode | - |
| maxTagPlaceholder | Placeholder for not showing tags | (omittedValues: LabeledValue[]) =&gt; VueNode | - |
| menuItemSelectedIcon | The custom menuItemSelected icon with multiple options | VueNode | - |
| notFoundContent | Specify content to show when no result matches | VueNode | - |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData&lt;BaseOptionType&gt;, info: &#123; index: number &#125;) =&gt; VueNode | - |
| popupRender | Customize dropdown content | (originNode: VueNode) =&gt; VueNode | - |
| prefix | The custom prefix | VueNode | - |
| removeIcon | The custom remove icon | VueNode | - |
| suffixIcon | The custom suffix icon. Customize icon will not response click open to avoid icon designed to do other interactive. You can use `pointer-events: none` style to bypass | VueNode | - |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | (props) =&gt; VueNode | - |

### Select Methods 
| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

### showSearch 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags` | boolean | true | - |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| (inputValue: string, option?: Option) =&gt; boolean | true | - |
| filterSort | Sort function for search options sorting, see Array.sort's compareFunction | (optionA: Option, optionB: Option, info: &#123; searchValue: string &#125;) =&gt; number | - | - |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label. When a string[] is provided, multiple fields are searched using OR matching | string \| string[] | value | - |
| searchValue | The current input "search" text | string | - | - |
| onSearch | Callback function that is fired when input changed | (value: string) =&gt; void | - | - |

### Option props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Disable this option | boolean | false | - |
| title | title attribute of Select Option | string | - | - |
| value | Default to filter with this property | string \| number | - | - |

### OptGroup props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Group key | string | - | - |
| label | Group label | string \| VueNode | - | - |
| title | title attribute of Select Option | string | - | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |

## FAQ

### Why sometimes search will show 2 same option when in `tags` mode? 
It's caused by option with different `label` and `value`. You can use `optionFilterProp="label"` to change filter logic instead.

### When I click elements in popupRender, the select dropdown will not be closed? 
You can control it by `open` prop.

### I don't want dropdown close when click inside `popupRender`? 
Select closes when it loses focus. Prevent the popup content `mousedown` event when custom popup content should keep the dropdown open. See `demo/custom-dropdown-menu.md`.

### Why sometimes customize Option cause scroll break? 
Virtual scroll internally assumes a `24px` item height. Adjust internal `listItemHeight` and `listHeight` only when custom option height makes scrolling inaccurate. Note: `listItemHeight` and `listHeight` are internal props. Please only modify when necessary.

### Why a11y test report missing `aria-` props? 
Select only create a11y auxiliary node when operating on. Please open Select and retry. For `aria-label` & `aria-labelledby` miss warning, please add related prop to Select with your own requirement.

Default virtual scrolling will create a mock element to simulate an accessible binding. If a screen reader needs to fully access the entire list, you can set `:virtual="false"` to disable virtual scrolling and the accessibility option will be bound to the actual element.

### Custom tags generated using `tagRender` slot will pop up a drop-down box when clicked to close 
If clicking a custom tag close element should not reopen the dropdown, stop the `mousedown` event on that element. See `demo/custom-tag-render.md`.
