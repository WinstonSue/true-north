# Dynamic

## Description (en-US)

The count will be animated as it changes.

## Source

```vue
<script setup lang="ts">
import { Minus, Plus, CircleHelp } from '@lucide/vue'
import { ref } from 'vue'

const count = ref(5)
const show = ref(true)

function increase() {
  count.value++
}

function decline() {
  let newCount = count.value - 1
  if (newCount < 0) {
    newCount = 0
  }
  count.value = newCount
}

function random() {
  const newCount = Math.floor(Math.random() * 100)
  count.value = newCount
}
</script>

<template>
  <sue-space vertical>
    <sue-space size="large">
      <sue-badge :count="count">
        <sue-avatar shape="square" size="large" />
      </sue-badge>
      <sue-space-compact>
        <sue-button @click="decline">
          <template #icon>
            <Minus />
          </template>
        </sue-button>
        <sue-button @click="increase">
          <template #icon>
            <Plus />
          </template>
        </sue-button>
        <sue-button @click="random">
          <template #icon>
            <CircleHelp />
          </template>
        </sue-button>
      </sue-space-compact>
    </sue-space>
    <sue-space size="large">
      <sue-badge :dot="show">
        <sue-avatar shape="square" size="large" />
      </sue-badge>
      <sue-switch v-model:checked="show" />
    </sue-space>
  </sue-space>
</template>
```
