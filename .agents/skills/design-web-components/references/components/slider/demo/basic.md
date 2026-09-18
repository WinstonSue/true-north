# Basic

## Description (en-US)

Basic slider. When `range` is `true`, display as dual thumb mode. When `disable` is `true`, the slider will not be interactable.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(false)
const value = ref(30)
const valueRange = ref([20, 50])
</script>

<template>
  <sue-slider v-model:value="value" :disabled="disabled" />
  <sue-slider v-model:value="valueRange" range :disabled="disabled" />
  Disabled: <sue-switch v-model:checked="disabled" size="small" />
</template>
```
