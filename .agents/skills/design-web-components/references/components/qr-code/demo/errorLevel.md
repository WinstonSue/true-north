# Error Level

## Description (en-US)

set Error Level.

## Source

```vue
<script setup lang="ts">
import type { QRCodeProps } from '@sue/design-web-vue'
import { ref } from 'vue'

const level = ref<QRCodeProps['errorLevel']>('M')
</script>

<template>
  <sue-qrcode style="margin-bottom: 16px;" :error-level="level" value="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <sue-segmented v-model:value="level" :options="['L', 'M', 'Q', 'H']" />
</template>
```
