# Preset Ranges

## Description (en-US)

We can set preset ranges to RangePicker to improve user experience. Since `5.8.0`, preset value supports callback function.

## Source

```vue
<script setup lang="ts">
import type { RangePickerProps } from '@sue/design-web-vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { h } from 'vue'

const rangePresets: RangePickerProps['presets'] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
]

function handleChange(date: Dayjs | null) {
  if (date) {
    console.log('Date: ', date)
  }
  else {
    console.log('Clear')
  }
}

function handleRangeChange(dates: null | (Dayjs | null)[], dateStrings: string[]) {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1])
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
  }
  else {
    console.log('Clear')
  }
}
</script>

<template>
  <sue-space vertical :size="12">
    <sue-date-picker
      :presets="[
        { label: 'Yesterday', value: dayjs().add(-1, 'd') },
        { label: 'Last Week', value: dayjs().add(-7, 'd') },
        { label: 'Last Month', value: dayjs().add(-1, 'month') },
      ]"
      @change="handleChange"
    />
    <sue-range-picker :presets="rangePresets" @change="handleRangeChange" />
    <sue-range-picker
      :presets="[
        {
          label: h('span', { 'aria-label': 'Current Time to End of Day' }, 'Now ~ EOD'),
          value: () => [dayjs(), dayjs().endOf('day')],
        },
        ...rangePresets,
      ]"
      show-time
      format="YYYY/MM/DD HH:mm:ss"
      @change="handleRangeChange"
    />
  </sue-space>
</template>
```
