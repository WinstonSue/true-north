# With Badge

## Description (en-US)

Usually used for reminders and notifications.

## Source

```vue
<script setup lang="ts">
import { User } from '@lucide/vue'
</script>

<template>
  <sue-space :size="24">
    <sue-badge :count="1">
      <sue-avatar shape="square">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
    </sue-badge>
    <sue-badge dot>
      <sue-avatar shape="square">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
    </sue-badge>
  </sue-space>
</template>
```
