# With clear icon

## Description (en-US)

Customize clear button.

## Source

```vue
<script setup lang="ts">
import { SquareX } from '@lucide/vue'
import { h, ref } from 'vue'

const value = ref('hello world')
const customAllowClear = {
  clearIcon: h(SquareX),
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-mentions v-model:value="value" allow-clear />
    <sue-mentions v-model:value="value" :allow-clear="customAllowClear" />
    <sue-mentions v-model:value="value" allow-clear :rows="3" />
  </sue-flex>
</template>
```
