# Jumper

## Description (en-US)

Jump to a page directly.

## Source

```vue
<script setup lang="ts">
import type { PaginationEmits } from '@sue/design-web-vue'

const handleChange: PaginationEmits['change'] = (pageNumber) => {
  console.log('Page: ', pageNumber)
}
</script>

<template>
  <sue-space direction="vertical" size="medium" style="width: 100%">
    <sue-pagination
      show-quick-jumper
      :default-current="2"
      :total="500"
      @change="handleChange"
    />
    <sue-pagination
      show-quick-jumper
      :default-current="2"
      :total="500"
      disabled
      @change="handleChange"
    />
  </sue-space>
</template>
```
