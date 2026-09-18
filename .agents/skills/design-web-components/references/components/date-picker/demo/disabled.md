# Disabled

## Description (en-US)

A disabled state of the `DatePicker`. You can also set as array to disable one of input.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { shallowRef } from 'vue'

dayjs.extend(customParseFormat)

const dateFormat = 'YYYY-MM-DD'
const disabledDateValue = shallowRef(dayjs('2015-06-06', dateFormat))
const disabledMonthValue = shallowRef(dayjs('2015-06', 'YYYY-MM'))
const disabledRangeValue = shallowRef([
  dayjs('2015-06-06', dateFormat),
  dayjs('2015-06-06', dateFormat),
])
const partiallyDisabledRangeValue = shallowRef([
  dayjs('2019-09-03', dateFormat),
  dayjs('2019-11-22', dateFormat),
])
const minMaxValue = shallowRef(dayjs('2019-09-03', dateFormat))
</script>

<template>
  <sue-space vertical :size="12">
    <sue-date-picker v-model:value="disabledDateValue" disabled />
    <sue-date-picker v-model:value="disabledMonthValue" picker="month" disabled />
    <sue-range-picker
      v-model:value="disabledRangeValue"
      disabled
    />
    <sue-range-picker
      v-model:value="partiallyDisabledRangeValue"
      :disabled="[false, true]"
    />
    <sue-date-picker
      v-model:value="minMaxValue"
      :min-date="dayjs('2019-06-01', dateFormat)"
      :max-date="dayjs('2020-06-30', dateFormat)"
    />
  </sue-space>
</template>
```
