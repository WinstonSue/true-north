# Placement

## Description (en-US)

Tab's placement: start, end, top or bottom. Will auto switch to `top` in mobile.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

type TabPlacement = 'top' | 'bottom' | 'start' | 'end'

interface TabItem {
  key: string
  label: string
  content: string
}

const tabPlacement = ref<TabPlacement>('start')

const items: TabItem[] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Content of Tab ${id}`,
  }
})
</script>

<template>
  <sue-space style="margin-bottom: 24px;">
    Tab placement:
    <sue-radio-group v-model:value="tabPlacement">
      <sue-radio-button value="top">
        top
      </sue-radio-button>
      <sue-radio-button value="bottom">
        bottom
      </sue-radio-button>
      <sue-radio-button value="start">
        start
      </sue-radio-button>
      <sue-radio-button value="end">
        end
      </sue-radio-button>
    </sue-radio-group>
  </sue-space>
  <sue-tabs :tab-placement="tabPlacement" :items="items" />
</template>
```
