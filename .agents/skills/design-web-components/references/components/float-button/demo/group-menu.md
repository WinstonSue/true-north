# Menu mode

## Description (en-US)

Open menu mode with `trigger`, which could be `hover` or `click`.

## Source

```vue
<script setup lang="ts">
import { MessageSquare, Headset } from '@lucide/vue'
</script>

<template>
  <sue-float-button-group
    trigger="click"
    type="primary"
    shape="square"
    style="inset-inline-end: 24px"
  >
    <template #icon>
      <Headset />
    </template>
    <sue-float-button />
    <sue-float-button>
      <template #icon>
        <MessageSquare />
      </template>
    </sue-float-button>
  </sue-float-button-group>

  <sue-float-button-group
    trigger="hover"
    type="primary"
    style="inset-inline-end: 94px"
  >
    <template #icon>
      <Headset />
    </template>
    <sue-float-button />
    <sue-float-button>
      <template #icon>
        <MessageSquare />
      </template>
    </sue-float-button>
  </sue-float-button-group>
</template>

<style scoped>

</style>
```
