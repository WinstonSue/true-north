# Basic

## Description (en-US)

Usage of basic Tag, and it could be closable and customize close button by set `closeIcon` property, will display default close button when `closeIcon` is setting to `true`. Closable Tag supports `onClose` events.

## Source

```vue
<script setup lang="ts">
import { CircleX, Trash2 } from '@lucide/vue'
import { shallowRef } from 'vue'

function preventDefault {
  console.log('Clicked! Default Not Close.')
}
const tag2 = shallowRef(true)
function handleCloseTag2 {
  tag2.value = false
}
const tag3 = shallowRef(true)
function handleCloseTag3 {
  tag3.value = false
}
function handleClick {
  console.log('click')
}
</script>

<template>
  <sue-flex gap="small" align="center" wrap>
    <sue-tag @click="handleClick">
      Tag 1
    </sue-tag>

    <sue-tag>
      <a href="" target="_blank" rel="noopener noreferrer">
        Link
      </a>
    </sue-tag>
    <sue-tag close-icon @close="preventDefault">
      Prevent Default
    </sue-tag>
    <sue-tag v-if="tag2" @close="handleCloseTag2">
      <template #closeIcon>
        <CircleX />
      </template>
      Tag 2
    </sue-tag>

    <sue-tag
      v-if="tag3"
      :closable="{
        'aria-label': 'Close Button',
      }"
      @close="handleCloseTag3"
    >
      <template #closeIcon>
        <Trash2 />
      </template>
      Tag 3
    </sue-tag>
  </sue-flex>
</template>
```
