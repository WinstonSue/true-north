# Static confirmation

## Description (en-US)

Use `confirm()` to show a confirmation modal dialog. Let onCancel/onOk function return a promise object to delay closing the dialog.

## Source

```vue
<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
import { Modal } from '@sue/design-web-vue'
import { h } from 'vue'

const confirm = Modal.confirm
function showConfirm() {
  confirm({
    title: 'Do you want to delete these items?',
    icon: h(CircleAlert),
    content: 'Some descriptions',
    onOk() {
      console.log('OK')
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}

function showPromiseConfirm() {
  confirm({
    title: 'Do you want to delete these items?',
    icon: h(CircleAlert),
    content: 'When clicked the OK button, this dialog will be closed after 1 second',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
      }).catch(() => console.log('Oops errors!'))
    },
    onCancel() {},
  })
}

function showDeleteConfirm() {
  confirm({
    title: 'Are you sure delete this task?',
    icon: h(CircleAlert),
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      console.log('OK')
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}

function showPropsConfirm() {
  confirm({
    title: 'Are you sure delete this task?',
    icon: h(CircleAlert),
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'danger',
    okButtonProps: {
      disabled: true,
    },
    cancelText: 'No',
    onOk() {
      console.log('OK')
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}
</script>

<template>
  <sue-space wrap>
    <sue-button @click="showConfirm">
      Confirm
    </sue-button>
    <sue-button @click="showPromiseConfirm">
      With Confirm
    </sue-button>
    <sue-button type="dashed" @click="showDeleteConfirm">
      Delete
    </sue-button>
    <sue-button type="dashed" @click="showPropsConfirm">
      With extra props
    </sue-button>
  </sue-space>
</template>
```
