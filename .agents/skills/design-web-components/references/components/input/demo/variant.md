# Variants

## Description (en-US)

Variants of Input, there are four variants: `outlined` `filled` `borderless` and `underlined`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <sue-flex vertical :gap="12">
    <sue-input v-model:value="value" placeholder="Outlined" />
    <sue-input v-model:value="value" placeholder="Filled" variant="filled" />
    <sue-input v-model:value="value" placeholder="Borderless" variant="borderless" />
    <sue-input v-model:value="value" placeholder="Underlined" variant="underlined" />
    <sue-input-search v-model:value="value" placeholder="Filled" variant="filled" />
  </sue-flex>
</template>
```
