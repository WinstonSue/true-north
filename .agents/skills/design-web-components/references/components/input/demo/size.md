# Three sizes of Input

## Description (en-US)

There are three sizes of an Input box: `large` (40px), `medium` (32px) and `small` (24px).

## Source

```vue
<script setup lang="ts">
import { User } from '@lucide/vue'
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-input v-model:value="value" size="large" placeholder="large size">
      <template #prefix>
        <User />
      </template>
    </sue-input>
    <sue-input v-model:value="value" placeholder="medium size">
      <template #prefix>
        <User />
      </template>
    </sue-input>
    <sue-input v-model:value="value" size="small" placeholder="small size">
      <template #prefix>
        <User />
      </template>
    </sue-input>
  </sue-flex>
</template>
```
