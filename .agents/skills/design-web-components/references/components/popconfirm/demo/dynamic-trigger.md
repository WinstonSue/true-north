# Conditional trigger

## Description (en-US)

Make it pop up under some conditions.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'
import { ref } from 'vue'

const [messageApi, ContextHolder] = message.useMessage()

const open = ref(false)
const condition = ref(true)

function confirm() {
  open.value = false
  messageApi.success('Next step.')
}

function cancel() {
  open.value = false
  messageApi.error('Click on cancel.')
}

function handleOpenChange(value: boolean) {
  if (!value) {
    open.value = value
    return
  }
  if (condition.value) {
    confirm()
  }
  else {
    open.value = value
  }
}
</script>

<template>
  <ContextHolder />
  <sue-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    :open="open"
    ok-text="Yes"
    cancel-text="No"
    @open-change="handleOpenChange"
    @confirm="confirm"
    @cancel="cancel"
  >
    <sue-button danger>
      Delete a task
    </sue-button>
  </sue-popconfirm>
  <br>
  <br>
  Whether directly execute:
  <sue-switch v-model:checked="condition" />
</template>
```
