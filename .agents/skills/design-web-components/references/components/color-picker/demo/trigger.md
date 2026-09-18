# Custom Trigger

## Description (en-US)

Triggers for customizing color panels.

## Source

```vue
<script setup lang="ts">
import type { ColorValueType } from '@sue/design-web-vue'
import { computed, shallowRef } from 'vue'

type Color = Extract<ColorValueType, string | { cleared: any }>

const color = shallowRef<Color>('#1677ff')

const bgColor = computed(() => {
  return typeof color.value === 'string'
    ? color.value
    : color.value?.toHexString?.() ?? '#1677ff'
})
</script>

<template>
  <sue-color-picker v-model:value="color">
    <sue-button type="primary" :style="{ backgroundColor: bgColor }">
      open
    </sue-button>
  </sue-color-picker>
</template>
```
