# badge

## Description (en-US)

FloatButton with Badge.

## Source

```vue
<script setup lang="ts">
import { CircleHelp } from '@lucide/vue'
</script>

<template>
  <sue-float-button shape="circle" style="inset-inline-end: calc(24px + 70px + 70px)" :badge="{ dot: true }" />
  <sue-float-button-group shape="circle" style="inset-inline-end: calc(24px + 70px)">
    <sue-float-button href="https://@sue/design-web-vue.com" :badge="{ count: 5, color: 'blue' }">
      <template #tooltip>
        <div>Custom badge color</div>
      </template>
    </sue-float-button>
    <sue-float-button :badge="{ count: 5 }" />
  </sue-float-button-group>
  <sue-float-button-group shape="circle">
    <sue-float-button :badge="{ count: 12 }">
      <template #icon>
        <CircleHelp />
      </template>
    </sue-float-button>
    <sue-float-button :badge="{ count: 123, overflowCount: 999 }" />
    <sue-float-back-top :visibility-height="0" />
  </sue-float-button-group>
</template>
```
