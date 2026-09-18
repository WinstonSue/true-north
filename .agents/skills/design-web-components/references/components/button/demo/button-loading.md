# Auto Loading Button

## Description (en-US)

`ButtonLoading` listens to the click callback return value. When it returns a Promise, the button enters loading state until the Promise settles. It supports common Button props and slots, while `loading` is controlled internally.

## Source

```vue
<script setup lang="ts">
import { RefreshCw, Upload } from '@lucide/vue'

function delay() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 2000)
  })
}
</script>

<template>
  <sue-flex gap="small" vertical>
    <sue-flex gap="small" wrap>
      <sue-button-loading type="primary" :on-click="delay">
        Submit
      </sue-button-loading>
      <sue-button-loading danger :on-click="delay">
        Delete
      </sue-button-loading>
      <sue-button-loading type="primary" :on-click="delay">
        <template #icon>
          <Upload />
        </template>
        Upload
      </sue-button-loading>
      <sue-button-loading type="primary" :on-click="delay">
        Custom Loading
        <template #loadingIcon>
          <RefreshCw spin />
        </template>
      </sue-button-loading>
    </sue-flex>
    <sue-button-loading block type="primary" :on-click="delay">
      Block Submit
    </sue-button-loading>
  </sue-flex>
</template>
```
