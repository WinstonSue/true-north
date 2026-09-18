# Confirm Button Group

## Description (en-US)

`ButtonGroup.Confirm` renders a common cancel/confirm action group. The confirm button enters loading state automatically when `onConfirm` returns a Promise, and cancel is disabled while it is pending. Text, size, and per-button props can be customized for different confirmation flows.

## Source

```vue
<script setup lang="ts">
function delay() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 2000)
  })
}

function cancel() {
  console.log('cancel')
}
</script>

<template>
  <sue-flex gap="small" vertical>
    <sue-flex gap="small" wrap>
      <sue-button-group-confirm :on-confirm="delay" :on-cancel="cancel" />
      <sue-button-group-confirm
        confirm-text="Save"
        cancel-text="Back"
        :on-confirm="delay"
        :on-cancel="cancel"
      />
    </sue-flex>
    <sue-flex gap="small" wrap>
      <sue-button-group-confirm
        size="small"
        confirm-text="Delete"
        :on-confirm="delay"
        :on-cancel="cancel"
        :confirm-props="{ danger: true }"
        :cancel-props="{ type: 'dashed' }"
      />
      <sue-button-group-confirm
        size="large"
        confirm-text="Publish"
        cancel-text="Draft"
        :on-confirm="delay"
        :on-cancel="cancel"
        :confirm-props="{ color: 'green', variant: 'solid' }"
        :cancel-props="{ type: 'text' }"
      />
    </sue-flex>
  </sue-flex>
</template>
```
