# Prefix and Suffix

## Description (en-US)

Custom `prefix` and `suffixIcon`.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const defaultOpenValue = dayjs('00:00:00', 'HH:mm:ss')

function onChange(time: any, timeString: string) {
  console.log(time, timeString)
}
</script>

<template>
  <sue-space vertical :size="12">
    <sue-time-picker
      :default-open-value="defaultOpenValue"
      @change="onChange"
    >
      <template #suffixIcon>
        <Smile />
      </template>
    </sue-time-picker>
    <sue-time-picker>
      <template #prefix>
        <Smile />
      </template>
    </sue-time-picker>
    <sue-time-range-picker>
      <template #prefix>
        <Smile />
      </template>
    </sue-time-range-picker>
  </sue-space>
</template>
```
