# Date Format

## Description (en-US)

We can set the date format by `format`. When `format` is an array, the input box can be entered in any of the valid formats of the array.

## Source

```vue
<script setup lang="ts">
import type { DatePickerProps } from '@sue/design-web-vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { shallowRef } from 'vue'

const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']

dayjs.extend(customParseFormat)

const customFormat: DatePickerProps['format'] = value =>
  `custom format: ${value.format(dateFormat)}`

const customWeekStartEndFormat: DatePickerProps['format'] = value =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`

const basicValue = shallowRef(dayjs('2015/01/01', dateFormat))
const listValue = shallowRef(dayjs('01/01/2015', dateFormatList[0]))
const monthValue = shallowRef(dayjs('2015/01', monthFormat))
const weekValue = shallowRef(dayjs())
const rangeValue = shallowRef([
  dayjs('2015/01/01', dateFormat),
  dayjs('2015/01/01', dateFormat),
])
const customValue = shallowRef(dayjs('2015/01/01', dateFormat))
</script>

<template>
  <sue-space vertical :size="12">
    <sue-date-picker v-model:value="basicValue" :format="dateFormat" />
    <sue-date-picker v-model:value="listValue" :format="dateFormatList" />
    <sue-date-picker
      v-model:value="monthValue"
      picker="month"
      :format="monthFormat"
    />
    <sue-date-picker v-model:value="weekValue" picker="week" :format="customWeekStartEndFormat" />
    <sue-range-picker
      v-model:value="rangeValue"
      :format="dateFormat"
    />
    <sue-date-picker v-model:value="customValue" :format="customFormat" />
  </sue-space>
</template>
```
