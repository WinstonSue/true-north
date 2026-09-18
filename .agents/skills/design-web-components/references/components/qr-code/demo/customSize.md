# Custom Size

## Description (en-US)

Custom Size.

## Source

```vue
<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import { shallowRef } from 'vue'

const size = shallowRef(160)
const MIN_SIZE = 48
const MAX_SIZE = 300
function increase() {
  const fn = (prevSize: number) => {
    const newSize = prevSize + 10
    if (newSize >= MAX_SIZE) {
      return MAX_SIZE
    }
    return newSize
  }
  size.value = fn(size.value)
}

function decline() {
  const fn = (prevSize: number) => {
    const newSize = prevSize - 10
    if (newSize <= MIN_SIZE) {
      return MIN_SIZE
    }
    return newSize
  }
  size.value = fn(size.value)
}
</script>

<template>
  <sue-space-compact class="mb-16px">
    <sue-button :disabled="size <= MIN_SIZE" @click="decline">
      <template #icon>
        <Minus />
      </template>
      Smaller
    </sue-button>
    <sue-button :disabled="size >= MAX_SIZE" @click="increase">
      <template #icon>
        <Plus />
      </template>
      Larger
    </sue-button>
  </sue-space-compact>
  <sue-qrcode
    error-level="H"
    :size="size"
    :icon-size="size / 4"
    value="https://@sue/design-web-vue.com/"
    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
  />
</template>
```
