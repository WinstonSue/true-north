# Disabled Date &amp; Time

## Description (en-US)

Disable specific dates and times by using `disabledDate` and `disabledTime` respectively, and `disabledTime` only works with `showTime`.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

function range(start: number, end: number) {
  const result: number[] = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

function disabledDate(current: any) {
  return current && current < dayjs().endOf('day')
}

function disabledDateForMonth(current: any) {
  return current && current < dayjs().startOf('month')
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  }
}

function disabledRangeTime(_: any, type: 'start' | 'end') {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    }
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  }
}
</script>

<template>
  <sue-space vertical :size="12">
    <sue-date-picker
      format="YYYY-MM-DD HH:mm:ss"
      :disabled-date="disabledDate"
      :disabled-time="disabledDateTime"
      :show-time="{ defaultOpenValue: dayjs('00:00:00', 'HH:mm:ss') }"
    />
    <sue-date-picker picker="month" :disabled-date="disabledDateForMonth" />
    <sue-range-picker :disabled-date="disabledDate" />
    <sue-range-picker
      :disabled-date="disabledDate"
      :disabled-time="disabledRangeTime"
      :show-time="{
        hideDisabledOptions: true,
        defaultOpenValue: [
          dayjs('00:00:00', 'HH:mm:ss'),
          dayjs('11:59:59', 'HH:mm:ss'),
        ],
      }"
      format="YYYY-MM-DD HH:mm:ss"
    />
  </sue-space>
</template>
```
