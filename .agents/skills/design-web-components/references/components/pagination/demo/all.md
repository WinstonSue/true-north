# Show All

## Description (en-US)

Show all configured prop.

## Source

```vue
<script setup lang="ts">
import type { PaginationProps } from '@sue/design-web-vue'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
</script>

<template>
  <sue-pagination
    :total="85"
    show-size-changer
    show-quick-jumper
    :show-total="showTotal"
  />
</template>
```
