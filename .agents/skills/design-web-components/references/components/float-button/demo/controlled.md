# Controlled mode

## Description (en-US)

Set the component to controlled mode through `open`, which need to be used together with `trigger`.

## Source

```vue
<script setup lang="ts">
import { MessageSquare, Headset } from '@lucide/vue'
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <sue-switch v-model:checked="open" style="margin: 16px;" />
  <sue-float-button-group
    :open="open"
    trigger="click"
    style="inset-inline-end: 24px;"
  >
    <template #icon>
      <Headset />
    </template>
    <sue-float-button />
    <sue-float-button />
    <sue-float-button>
      <template #icon>
        <MessageSquare />
      </template>
    </sue-float-button>
  </sue-float-button-group>
  <sue-float-button-group
    :open="open"
    shape="square"
    trigger="click"
    style="inset-inline-end: 88px;"
  >
    <template #icon>
      <Headset />
    </template>
    <sue-float-button />
    <sue-float-button />
    <sue-float-button>
      <template #icon>
        <MessageSquare />
      </template>
    </sue-float-button>
  </sue-float-button-group>
</template>
```
