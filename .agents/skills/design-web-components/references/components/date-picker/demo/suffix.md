# Prefix and Suffix

## Description (en-US)

Custom `prefix` and `suffixIcon`.

## Source

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { Smile } from '@lucide/vue'
import { h } from 'vue'

const smileIcon = h(Smile)

function handleChange(date: Dayjs | (Dayjs | null)[] | null, dateString: string | string[] | null) {
  console.log(date, dateString)
}
</script>

<template>
  <sue-space vertical :size="12">
    <sue-date-picker :suffix-icon="smileIcon" @change="handleChange" />
    <sue-date-picker :suffix-icon="smileIcon" picker="month" @change="handleChange" />
    <sue-range-picker :suffix-icon="smileIcon" @change="handleChange" />
    <sue-date-picker :suffix-icon="smileIcon" picker="week" @change="handleChange" />
    <sue-date-picker suffix-icon="ab" @change="handleChange" />
    <sue-date-picker suffix-icon="ab" picker="month" @change="handleChange" />
    <sue-range-picker suffix-icon="ab" @change="handleChange" />
    <sue-date-picker suffix-icon="ab" picker="week" @change="handleChange" />
    <sue-date-picker :prefix="smileIcon" picker="week" @change="handleChange" />
    <sue-date-picker prefix="Event Period" picker="week" @change="handleChange" />
    <sue-range-picker :prefix="smileIcon" picker="week" @change="handleChange" />
    <sue-range-picker prefix="Event Period" picker="week" @change="handleChange" />
  </sue-space>
</template>
```
