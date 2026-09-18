# Content

## Description (en-US)

Setting the `content` property allows you to show a FloatButton with a description.

> supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.

## Source

```vue
<script setup lang="ts">
import { FileText } from '@lucide/vue'
</script>

<template>
  <sue-float-button
    shape="square"
    content="HELP INFO"
    style="inset-inline-end: 24px;"
  >
    <template #icon>
      <FileText />
    </template>
  </sue-float-button>
  <sue-float-button
    shape="square"
    content="HELP INFO"
    style="inset-inline-end: 94px;"
  />
  <sue-float-button
    shape="square"
    content="HELP"
    style="inset-inline-end: 164px;"
  >
    <template #icon>
      <FileText />
    </template>
  </sue-float-button>
</template>
```
