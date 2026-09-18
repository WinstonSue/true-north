# Vertical Radio.Group

## Description (en-US)

Vertical Radio.Group, with more radios.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const val = shallowRef(1)
</script>

<template>
  <sue-radio-group v-model:value="val" vertical>
    <sue-radio :value="1">
      Option A
    </sue-radio>
    <sue-radio :value="2">
      Option B
    </sue-radio>
    <sue-radio :value="3">
      Option C
    </sue-radio>
    <sue-radio :value="4">
      More...
      <sue-input v-if="val === 4" style="width: 100px; margin-left: 10px" />
    </sue-radio>
  </sue-radio-group>
</template>
```
