---
title: "Calendar"
description: "A container that displays data in calendar form."
---

## When To Use

When data is in the form of dates, such as schedules, timetables, prices calendar, lunar calendar. This component also supports Year/Month switch.

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
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

**Note:** Part of the Calendar's locale is read from `value`. So, please set the locale of `dayjs` correctly.

```jsx
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// dayjs.locale('zh-cn');

<Calendar cellRender={cellRender} onPanelChange={onPanelChange} onSelect={onSelect} />
```

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| cellRender | Customize cell content | function(current: dayjs, info: { prefixCls: string, originNode: React.ReactElement, today: dayjs, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | - | 5.4.0 | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| fullCellRender | Customize cell content | function(current: dayjs, info: { prefixCls: string, originNode: React.ReactElement, today: dayjs, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | - | 5.4.0 | × |
| defaultValue | The date selected by default | [dayjs](https://day.js.org/) | - |  | × |
| disabledDate | Function that specifies the dates that cannot be selected, `currentDate` is same dayjs object as `value` prop which you shouldn't mutate it (https://github.com/yuce-design/yuce-design/issues/30987) | (currentDate: Dayjs) => boolean | - |  | × |
| fullscreen | Whether to display in full-screen | boolean | true |  | × |
| showWeek | Whether to display week number | boolean | false | 5.23.0 | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| headerRender | Render custom header in panel | function(object:{value: Dayjs, type: 'year' \| 'month', onChange: f(), onTypeChange: f()}) | - |  | × |
| locale | The calendar's locale | object | [(default)](https://github.com/yuce-design/yuce-design/blob/master/components/date-picker/locale/example.json) |  | × |
| mode | The display mode of the calendar | `month` \| `year` | `month` |  | × |
| validRange | To set valid range | \[[dayjs](https://day.js.org/), [dayjs](https://day.js.org/)] | - |  | × |
| value | The current selected date | [dayjs](https://day.js.org/) | - |  | × |
| onChange | Callback for when date changes | function(date: Dayjs) | - |  | × |
| onPanelChange | Callback for when panel changes | function(date: Dayjs, mode: string) | - |  | × |
| onSelect | Callback for when a date is selected, include source info | function(date: Dayjs, info: { source: 'year' \| 'month' \| 'date' \| 'customize' }) | - | `info`: 5.6.0 | × |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### How to use Calendar with customize date library? {#faq-customize-date-library}

See [Use custom date library](../../docs/react/use-custom-date-library.md#calendar)

### How to set locale for date-related components? {#faq-set-locale-date-components}

See [How to set locale for date-related components](/components/date-picker/#localization)

### Date-related components locale is not working? {#faq-locale-not-working}

See FAQ [Date-related-components-locale-is-not-working?](../../docs/react/faq.md#date-related-components-locale-is-not-working)

### How to get date from panel click? {#faq-get-date-panel-click}

`onSelect` provide `info.source` to help on this:

```tsx
<Calendar
  onSelect={(date, { source }) => {
    if (source === 'date') {
      console.log('Panel Select:', source);
    }
  }}
/>
```
