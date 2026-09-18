# Mini size

## Description (en-US)

Mini size pagination.

## Source

```vue
<script setup lang="ts">
import type { PaginationProps } from '@sue/design-web-vue'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
</script>

<template>
  <sue-space direction="vertical" size="medium" style="width: 100%">
    <sue-pagination size="small" :total="50" />
    <sue-pagination size="small" :total="50" show-size-changer show-quick-jumper />
    <sue-pagination size="small" :total="50" :show-total="showTotal" />
    <sue-pagination
      size="small"
      :total="50"
      disabled
      :show-total="showTotal"
      show-size-changer
      show-quick-jumper
    />
  </sue-space>
</template>
```
