# Red badge

## Description (en-US)

This will simply display a red badge, without a specific count. If count equals 0, it won't display the dot.

## Source

```vue
<script setup lang="ts">
import { Bell } from '@lucide/vue'
</script>

<template>
  <sue-space>
    <sue-badge dot>
      <Bell style="font-size: 16px" />
    </sue-badge>
    <sue-badge dot>
      <a href="#">Link something</a>
    </sue-badge>
  </sue-space>
</template>
```
