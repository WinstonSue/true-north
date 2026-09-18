# Customize close

## Description (en-US)

The close icon can be customized using `closeIcon`.

## Source

```vue
<script setup lang="ts">
import { CircleX } from '@lucide/vue'
</script>

<template>
  <sue-flex gap="small" align="center" wrap>
    <sue-tag closable close-icon="关闭">
      Tag 1
    </sue-tag>
    <sue-tag closable>
      Tag 2
      <template #closeIcon>
        <CircleX />
      </template>
    </sue-tag>
  </sue-flex>
</template>
```
