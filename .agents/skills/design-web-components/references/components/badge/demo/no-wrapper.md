# Standalone

## Description (en-US)

Used in standalone when children is empty.

## Source

```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <sue-space>
    <sue-switch v-model:checked="show" />
    <sue-badge :count="show ? 11 : 0" show-zero color="#faad14" />
    <sue-badge :count="show ? 25 : 0" />
    <sue-badge :count="show ? 1 : 0">
      <template #count>
        <Clock style="color: #f5222d" />
      </template>
    </sue-badge>
    <sue-badge
      class="site-badge-count-109"
      :count="show ? 109 : 0"
      :style="{ backgroundColor: '#52c41a' }"
    />
  </sue-space>
</template>
```
