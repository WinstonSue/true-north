# Clear Color

## Description (en-US)

Clear Color.

## Source

```vue
<script setup lang="ts">
import type { ColorValueType } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const color = shallowRef<ColorValueType>('#1677ff')
</script>

<template>
  <sue-color-picker v-model:value="color" allow-clear />
</template>
```
