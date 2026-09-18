# Range Picker

## Description (en-US)

Set range picker type by `picker` prop.

## Source

```vue
<script lang="ts" setup>
import { shallowRef } from 'vue'

const date = shallowRef()
const week = shallowRef()
const month = shallowRef()
const quarter = shallowRef()
const year = shallowRef()
</script>

<template>
  <sue-space vertical :size="12">
    <sue-range-picker v-model:value="date" />
    <sue-range-picker v-model:value="date" show-time />
    <sue-range-picker v-model:value="week" picker="week" />
    <sue-range-picker v-model:value="month" picker="month" />
    <sue-range-picker v-model:value="quarter" picker="quarter" />
    <sue-range-picker
      :id="{ start: 'startInput', end: 'endInput' }"
      v-model:value="year"
      picker="year"
      @focus="(_, info) => {
        console.log('Focus:', info.range)
      }"
      @blur="(_, info) => {
        console.log('Blur:', info.range)
      }"
    />
  </sue-space>
</template>
```
