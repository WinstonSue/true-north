---
title: Calendar
description: A container that displays data in calendar form.
---

## When To Use

- Use Calendar for month or year views where users scan date-related content. See `demo/basic.md`.
- Use card mode for compact dashboard widgets. See `demo/card.md`.
- Use custom headers, date cells, or notice calendars when dates need business content. See `demo/customize-header.md` and `demo/notice-calendar.md`.
- Prefer DatePicker when the user only needs to choose a date from a form field.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Notice Calendar | demo/notice-calendar.md |
| Card | demo/card.md |
| Selectable Calendar | demo/select.md |
| Lunar Calendar | demo/lunar.md |
| Show Week | demo/week.md |
| Customize Header | demo/customize-header.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| rootClass | - | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CalendarClassNamesType&lt;DateType&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CalendarStylesType&lt;DateType&gt; | - | - |
| locale | The calendar's locale | typeof enUS | [(default)] | - |
| validRange | To set valid range | [DateType, DateType] | - | - |
| disabledDate | Function that specifies the dates that cannot be selected, `currentDate` is same dayjs object as `value` prop which you [shouldn't mutate it] | (date: DateType) =&gt; boolean | - | - |
| cellRender | Customize cell content | (date: DateType, info: any) =&gt; VueNode | - | - |
| fullCellRender | Customize cell content | (date: DateType, info: any) =&gt; VueNode | - | - |
| headerRender | Render custom header in panel | HeaderRender&lt;DateType&gt; | - | - |
| value | The current selected date, support `v-model:value` | DateType | - | - |
| defaultValue | The date selected by default | DateType | - | - |
| mode | The display mode of the calendar | CalendarMode | `month` | - |
| fullscreen | Whether to display in full-screen | boolean | true | - |
| showWeek | Whether to display week number | boolean | false | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback for when date changes | (date: DateType) =&gt; void | - |
| update:value | - | (date: DateType) =&gt; void | - |
| panelChange | Callback for when panel changes | (date: DateType, mode: CalendarMode) =&gt; void | - |
| select | Callback for when a date is selected, include source info | (date: DateType, selectInfo: SelectInfo) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| cellRender | Customize cell content | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| fullCellRender | Customize cell content | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| headerRender | Render custom header in panel | (config: &#123; value: AnyObject, type: CalendarMode, onChange: (date: AnyObject) =&gt; void, onTypeChange: (type: CalendarMode) =&gt; void &#125;) =&gt; any | - |

## Semantic DOM 

| _semantic | demo/_semantic.md |
