# Sizes

## Description (en-US)

Three sizes.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)
</script>

<template>
  <sue-flex vertical :gap="12">
    <sue-rate v-model:value="value1" size="large" />
    <sue-rate v-model:value="value2" />
    <sue-rate v-model:value="value3" size="small" />
  </sue-flex>
</template>
```
