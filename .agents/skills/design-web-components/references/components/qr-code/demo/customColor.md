# Custom Color

## Description (en-US)

Custom Color.

## Source

```vue
<script setup lang="ts">
import { theme } from '@sue/design-web-vue'

const { useToken } = theme
const { token } = useToken()
</script>

<template>
  <sue-space>
    <sue-qrcode value="https://www.@sue/design-web-vue.com" :color="token.colorSuccessText" />
    <sue-qrcode value="https://www.@sue/design-web-vue.com" :color="token.colorInfoText" :bg-color="token.colorBgLayout" />
  </sue-space>
</template>
```
