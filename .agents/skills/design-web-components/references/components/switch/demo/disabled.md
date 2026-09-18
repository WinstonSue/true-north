# Disabled

## Description (en-US)

Disabled state of `Switch`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
const checked = ref(true)

function toggle() {
  disabled.value = !disabled.value
}
</script>

<template>
  <sue-space vertical>
    <sue-switch v-model:checked="checked" :disabled="disabled" />
    <sue-button type="primary" @click="toggle">
      Toggle disabled
    </sue-button>
  </sue-space>
</template>
```
