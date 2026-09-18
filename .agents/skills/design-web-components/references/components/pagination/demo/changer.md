# Changer

## Description (en-US)

Change `pageSize`.

## Source

```vue
<script setup lang="ts">
import type { PaginationEmits } from '@sue/design-web-vue'

const handleShowSizeChange: PaginationEmits['showSizeChange'] = (current, pageSize) => {
  console.log(current, pageSize)
}
</script>

<template>
  <sue-space direction="vertical" size="medium" style="width: 100%">
    <sue-pagination
      show-size-changer
      :default-current="3"
      :total="500"
      @show-size-change="handleShowSizeChange"
    />
    <sue-pagination
      show-size-changer
      :default-current="3"
      :total="500"
      disabled
      @show-size-change="handleShowSizeChange"
    />
  </sue-space>
</template>
```
