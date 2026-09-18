# Total number

## Description (en-US)

You can show the total number of data by setting `showTotal`.

## Source

```vue
<script setup lang="ts">
import type { PaginationProps } from '@sue/design-web-vue'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
const showRangeTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`
</script>

<template>
  <sue-space direction="vertical" size="medium" style="width: 100%">
    <sue-pagination
      :total="85"
      :show-total="showTotal"
      :default-page-size="20"
      :default-current="1"
    />
    <sue-pagination
      :total="85"
      :show-total="showRangeTotal"
      :default-page-size="20"
      :default-current="1"
    />
  </sue-space>
</template>
```
