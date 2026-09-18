# SFC Mode

## Description (en-US)

support sfc mode

## Source

```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'
</script>

<template>
  <div>
    <sue-timeline>
      <sue-timeline-item>
        测试
      </sue-timeline-item>
      <sue-timeline-item color="red">
        <div class="c-primary">
          测试
        </div>
        <template #icon>
          <Clock />
        </template>
      </sue-timeline-item>
    </sue-timeline>
  </div>
</template>
```
