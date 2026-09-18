---
title: "Select"
description: "A dropdown menu for displaying choices."
---

## When To Use

- A dropdown menu for displaying choices - an elegant alternative to the native `<select>` element.
- Utilizing [Radio](/components/radio/) is recommended when there are fewer total options (less than 5).
- You probably need [AutoComplete](/components/auto-complete/) if you're looking for an input box that can be typed or selected.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Select with search field | demo/search.md |
| Custom Search | demo/search-filter-option.md |
| multiple selection | demo/multiple.md |
| Sizes | demo/size.md |
| Custom dropdown options | demo/option-render.md |
| Tags | demo/tags.md |
| Option Group | demo/optgroup.md |
| coordinate | demo/coordinate.md |
| Get value of selected item | demo/label-in-value.md |
| Automatic tokenization | demo/automatic-tokenization.md |
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
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Select props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | Customize clear icon | boolean \| { clearIcon?: ReactNode } | false | 5.8.0: Support object type | 6.4.0 |
| classNames | Customize class for each semantic structure inside the Select component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.25.0 |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  | × |
| defaultOpen | Initial open state of dropdown | boolean | - |  | × |
| defaultValue | Initial selected option | string \| string\[] \| <br />number \| number\[] \| <br />LabeledValue \| LabeledValue\[] | - |  | × |
| disabled | Whether disabled select | boolean | false |  | × |
| popupMatchSelectWidth | Determine whether the popup menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | 5.5.0 | × |
| popupRender | Customize dropdown content | (originNode: ReactNode) => ReactNode | - | 5.25.0 | × |
| fieldNames | Customize node label, value, options，groupLabel field name | object | { label: `label`, value: `value`, options: `options`, groupLabel: `label` } | 4.17.0 (`groupLabel` added in 5.6.0) | × |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. [Example](https://codesandbox.io/s/4j168r7jw0) | function(triggerNode) | () => document.body |  | × |
| labelInValue | Whether to embed label in value, turn the format of value from `string` to { value: string, label: ReactNode } | boolean | false |  | × |
| listHeight | Config popup height | number | 256 |  | × |
| loading | Indicate loading state | boolean | false |  | × |
| loadingIcon | Customize the loading icon | ReactNode | `<Loader2 spin />` | 6.4.0 | 6.4.0 |
| maxCount | The max number of items can be selected, only applies when `mode` is `multiple` or `tags` | number | - | 5.13.0 | × |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number \| `responsive` | - | responsive: 4.10 | × |
| maxTagPlaceholder | Placeholder for not showing tags | ReactNode \| function(omittedValues) | - |  | × |
| maxTagTextLength | Max tag text length to show | number | - |  | × |
| menuItemSelectedIcon | The custom menuItemSelected icon with multiple options | ReactNode | `<Check />` |  | 6.4.0 |
| mode | Set mode of Select | `multiple` \| `tags` | - |  | × |
| notFoundContent | Specify content to show when no result matches | ReactNode | `Not Found` |  | × |
| open | Controlled open state of dropdown | boolean | - |  | × |
| optionLabelProp | Which prop value of option will render as content of select. [Example](https://codesandbox.io/s/antd-reproduction-template-tk678) | string | `children` |  | × |
| options | Select options. Will get better perf than jsx definition | { label, value }\[] | - |  | × |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData\<BaseOptionType\> , info: { index: number }) => React.ReactNode | - | 5.11.0 | × |
| placeholder | Placeholder of select | ReactNode | - |  | × |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  | × |
| prefix | The custom prefix | ReactNode | - | 5.22.0 | × |
| removeIcon | The custom remove icon | ReactNode | `<X />` |  | 6.4.0 |
| showSearch | Whether select is searchable | boolean \| [Object](#showsearch) | single: false, multiple: true | Object: 6.0.0 | 6.4.0 |
| size | Size of Select input | `large` \| `medium` \| `small` | `medium` |  | × |
| status | Set validation status | 'error' \| 'warning' | - | 4.19.0 | × |
| styles | Customize inline style for each semantic structure inside the Select component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.25.0 |
| suffixIcon | The custom suffix icon. Custom icons will not respond to clicks to open, because the replaced icon may be designed for other interactions. You can use `pointer-events: none` style to bypass | ReactNode | `<ChevronDown />` |  | 6.4.0 |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | (props) => ReactNode | - |  | × |
| labelRender | Customize selected label render (LabelInValueType definition see [LabelInValueType](https://github.com/react-component/select/blob/b39c28aa2a94e7754ebc570f200ab5fd33bd31e7/src/Select.tsx#L70)) | (props: LabelInValueType) => ReactNode | - | 5.15.0 | × |
| tokenSeparators | Separator used to tokenize, only applies when `mode="tags"` or `mode="multiple"` | string[] \| ((input: string) => string[]) | - | function: 6.5.0 | × |
| value | Current selected option (considered as a immutable array) | string \| string\[] \| <br />number \| number\[] \| <br />LabeledValue \| LabeledValue\[] | - |  | × |
| variant | Variants of selector | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 | 5.19.0 |
| virtual | Disable virtual scroll when set to false | boolean | true | 4.1.0 | × |
| onActive | Called when keyboard or mouse interaction occurs | function(value: string \| number \| LabeledValue) | - |  | × |
| onBlur | Called when blur | function | - |  | × |
| onChange | Called when select an option or input value change | function(value, option:Option \| Array&lt;Option>) | - |  | × |
| onClear | Called when clear | function | - | 4.6.0 | × |
| onDeselect | Called when an option is deselected, param is the selected option's value. Only called for `multiple` or `tags`, effective in multiple or tags mode only | function(value: string \| number \| LabeledValue) | - |  | × |
| onOpenChange | Called when dropdown open | (open: boolean) => void | - |  | × |
| onFocus | Called when focus | (event: FocusEvent) => void | - |  | × |
| onInputKeyDown | Called when key pressed | (event: KeyboardEvent) => void | - |  | × |
| onPopupScroll | Called when dropdown scrolls | (event: UIEvent) => void | - |  | × |
| onSelect | Called when an option is selected, the params are option's value (or key) and option instance | function(value: string \| number \| LabeledValue, option: Option) | - |  | × |

> Note, if you find that the drop-down menu scrolls with the page, or you need to trigger Select in other popup layers, please try to use `getPopupContainer={triggerNode => triggerNode.parentElement}` to fix the drop-down popup rendering node in the parent element of the trigger .

### showSearch

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags` | boolean | true |  |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| function(inputValue, option) | true |  |
| filterSort | Sort function for search options sorting, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction | (optionA: Option, optionB: Option, info: { searchValue: string }) => number | - | `searchValue`: 5.19.0 |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true. <br/> If `options` is set, it should be set to `label`. <br/> When a string[] is provided, multiple fields are searched using OR matching. | string \| string[] | `value` | `string[]`: 6.1.0 |
| searchValue | The current input "search" text | string | - |  |
| onSearch | Callback function that is fired when input changed | function(value: string) | - |  |
| searchIcon | Customize the search icon | ReactNode | `<Search />` | 6.4.0 |

### Select Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

### Option props

| Property  | Description                          | Type             | Default | Version |
| --------- | ------------------------------------ | ---------------- | ------- | ------- |
| className | The additional class to option       | string           | -       |         |
| disabled  | Disable this option                  | boolean          | false   |         |
| title     | `title` attribute of Select Option   | string           | -       |         |
| value     | Default to filter with this property | string \| number | -       |         |

### OptGroup props

| Property  | Description                        | Type            | Default | Version |
| --------- | ---------------------------------- | --------------- | ------- | ------- |
| key       | Group key                          | string          | -       |         |
| label     | Group label                        | React.ReactNode | -       |         |
| className | The additional class to option     | string          | -       |         |
| title     | `title` attribute of Select Option | string          | -       |         |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### Why sometimes search will show 2 same option when in `tags` mode? {#faq-tags-mode-duplicate}

It's caused by option with different `label` and `value`. You can use `optionFilterProp="label"` to change filter logic instead.

### When I click elements in popupRender, the select dropdown will not be closed? {#faq-popup-not-close}

You can control it by `open` prop: [codesandbox](https://codesandbox.io/s/ji-ben-shi-yong-antd-4-21-7-forked-gnp4cy?file=/demo.js).

### I don't want dropdown close when click inside `popupRender`? {#faq-popup-keep-open}

Select will close when it lose focus. You can prevent event to handle this:

```tsx
<Select
  popupRender={() => (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      Some Content
    </div>
  )}
/>
```

### Why sometimes customize Option cause scroll break? {#faq-custom-option-scroll}

Virtual scroll internal set item height as `24px`. You need to adjust `listItemHeight` when your option height is less and `listHeight` config list container height:

```tsx
<Select listItemHeight={10} listHeight={250} />
```

Note: `listItemHeight` and `listHeight` are internal props. Please only modify when necessary.

### Why a11y test report missing `aria-` props? {#faq-aria-attribute}

Select only create a11y auxiliary node when operating on. Please open Select and retry. For `aria-label` & `aria-labelledby` miss warning, please add related prop to Select with your own requirement.

Default virtual scrolling will create a mock element to simulate an accessible binding. If a screen reader needs to fully access the entire list, you can set `virtual={false}` to disable virtual scrolling and the accessibility option will be bound to the actual element.

### Why does clicking close on a custom `tagRender` tag open the dropdown? {#faq-tagrender-dropdown}

If you don't want a drop-down menu to appear automatically after clicking on an element (such as a close icon), you can prevent the `MouseDown` event from propagating on it.

```tsx
<Select
  tagRender={(props) => {
    const { closable, label, onClose } = props;
    return (
      <span className="border">
        {label}
        {closable ? (
          <span
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="cursor-pointer"
          >
            ❎
          </span>
        ) : null}
      </span>
    );
  }}
/>
```
