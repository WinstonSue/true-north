# Prefix / Suffix

## Description (en-US)

Add a prefix or suffix inside input.

## Source

```vue
<script setup lang="ts">
import { User } from '@lucide/vue'
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-input-number prefix="￥" style="width: 100%;" />

    <sue-space-compact block>
      <sue-space-addon>
        <User />
      </sue-space-addon>
      <sue-input-number prefix="￥" style="width: 100%;" />
    </sue-space-compact>

    <sue-input-number prefix="￥" disabled style="width: 100%;" />

    <sue-input-number suffix="RMB" style="width: 100%;" />
  </sue-flex>
</template>
```
