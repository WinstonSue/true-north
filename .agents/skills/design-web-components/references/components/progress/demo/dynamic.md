# Dynamic

## Description (en-US)

A dynamic progress bar is better.

## Source

```vue
<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import { ref } from 'vue'

const percent = ref(0)

function increase() {
  percent.value = Math.min(100, percent.value + 10)
}

function decline() {
  percent.value = Math.max(0, percent.value - 10)
}
</script>

<template>
  <sue-flex vertical gap="small">
    <sue-flex vertical gap="small">
      <sue-progress :percent="percent" type="line" />
      <sue-progress :percent="percent" type="circle" />
    </sue-flex>
    <sue-space-compact>
      <sue-button @click="decline">
        <template #icon>
          <Minus />
        </template>
      </sue-button>
      <sue-button @click="increase">
        <template #icon>
          <Plus />
        </template>
      </sue-button>
    </sue-space-compact>
  </sue-flex>
</template>
```
