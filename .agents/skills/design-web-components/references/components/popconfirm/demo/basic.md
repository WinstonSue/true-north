# Basic

## Description (en-US)

The basic example supports the title and description props of confirmation.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

function confirm(e?: MouseEvent) {
  console.log(e)
  messageApi.success('Click on Yes')
}

function cancel(e?: MouseEvent) {
  console.log(e)
  messageApi.error('Click on No')
}
</script>

<template>
  <ContextHolder />
  <sue-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="confirm"
    @cancel="cancel"
  >
    <sue-button danger>
      Delete
    </sue-button>
  </sue-popconfirm>
</template>
```
