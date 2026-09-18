# Asynchronously close on Promise

## Description (en-US)

Asynchronously close a popconfirm when the OK button is pressed. For example, you can use this pattern when you submit a form.

## Source

```vue
<script setup lang="ts">
function confirm() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), 3000)
  })
}

function handleOpenChange() {
  console.log('open change')
}
</script>

<template>
  <sue-popconfirm
    title="Title"
    description="Open Popconfirm with Promise"
    @confirm="confirm"
    @open-change="handleOpenChange"
  >
    <sue-button type="primary">
      Open Popconfirm with Promise
    </sue-button>
  </sue-popconfirm>
</template>
```
