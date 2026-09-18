# Responsive Size

## Description (en-US)

Avatar size can be automatically adjusted based on the screen size.

## Source

```vue
<script setup lang="ts">
import { Hexagon } from '@lucide/vue'
</script>

<template>
  <sue-avatar
    :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }"
  >
    <template #icon>
      <Hexagon />
    </template>
  </sue-avatar>
</template>
```
