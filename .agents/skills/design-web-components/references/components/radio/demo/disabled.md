# disabled

## Description (en-US)

Radio unavailable.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const disabled = shallowRef(true)
function toggleDisabled() {
  disabled.value = !disabled.value
}
</script>

<template>
  <sue-space direction="vertical">
    <sue-space>
      <sue-radio :checked="false" :disabled="disabled">
        Disabled
      </sue-radio>
      <sue-radio :checked="true" :disabled="disabled">
        Disabled
      </sue-radio>
    </sue-space>
    <sue-button type="primary" @click="toggleDisabled">
      Toggle disabled
    </sue-button>
  </sue-space>
</template>
```
