# Customized Modal.method() footer

## Description (en-US)

Customize the `Modal.confirm` footer render function to extend the default confirmation buttons.

## Source

```vue
<script setup lang="ts">
import { Button, Modal } from '@sue/design-web-vue'
import { h } from 'vue'

function handleConfirm() {
  Modal.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    footer: ({ extra }: any) => {
      return [
        h(Button, undefined, { default: () => 'Custom Button' }),
        h(extra.OkBtn),
        h(extra.CancelBtn),
      ]
    },
  })
}
</script>

<template>
  <sue-button type="primary" @click="handleConfirm">
    Open Modal Confirm
  </sue-button>
</template>
```
