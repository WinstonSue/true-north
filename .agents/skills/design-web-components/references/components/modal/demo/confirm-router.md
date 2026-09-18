# destroy confirmation modal dialog

## Description (en-US)

`Modal.destroyAll()` will destroy all confirmation modal dialogs. Usually, you can use it in router change event to destroy confirm modal dialog automatically.

## Source

```vue
<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
import { Button, Modal } from '@sue/design-web-vue'
import { h } from 'vue'

const confirm = Modal.confirm

function destroyAll() {
  Modal.destroyAll()
}

function showConfirm() {
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      confirm({
        icon: h(CircleAlert),
        content: h(Button, {
          onClick: destroyAll,
        }, {
          default: () => 'Click to destroy All',
        }),
        onOk() {
          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    }, i * 500)
  }
}
</script>

<template>
  <sue-button @click="showConfirm">
    Confirm
  </sue-button>
</template>
```
