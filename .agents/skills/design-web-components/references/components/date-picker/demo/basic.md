# Basic

## Description (en-US)

Basic use case. Users can select or input a date in a panel.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const date = shallowRef()
const week = shallowRef()
const month = shallowRef()
const year = shallowRef()
const quarter = shallowRef()
</script>

<template>
  <sue-space vertical>
    <sue-date-picker v-model:value="date" />
    <sue-date-picker v-model:value="week" picker="week" />
    <sue-date-picker v-model:value="month" picker="month" />
    <sue-date-picker v-model:value="quarter" picker="quarter" />
    <sue-date-picker v-model:value="year" picker="year" />
  </sue-space>
</template>
```
