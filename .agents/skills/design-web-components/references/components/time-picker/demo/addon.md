# Addon

## Description (en-US)

Render addon contents to time picker panel's bottom.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

function handleOpenChange(val: boolean) {
  open.value = val
}

function handleClose() {
  open.value = false
}
</script>

<template>
  <sue-time-picker
    :open="open"
    @open-change="handleOpenChange"
  >
    <template #renderExtraFooter>
      <sue-button size="small" type="primary" @click="handleClose">
        OK
      </sue-button>
    </template>
  </sue-time-picker>
</template>
```
