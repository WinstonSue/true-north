# Customize icon

## Description (en-US)

Set `icon` props to customize the icon.

## Source

```vue
<script setup lang="ts">
import { CircleHelp } from '@lucide/vue'
</script>

<template>
  <sue-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
  >
    <template #icon>
      <CircleHelp style="color: red" />
    </template>
    <sue-button danger>
      Delete
    </sue-button>
  </sue-popconfirm>
</template>
```
