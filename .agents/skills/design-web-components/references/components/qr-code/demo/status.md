# other status

## Description (en-US)

The `status` can be controlled by the value status, four values ​​of `active`, `expired`, `loading`, `scanned` are provided.

## Source

```vue
<script setup lang="ts">
const value = 'https://www.@sue/design-web-vue.com'
</script>

<template>
  <sue-flex gap="middle" wrap>
    <sue-qrcode :value="value" status="loading" />
    <sue-qrcode :value="value" status="expired" @refresh="() => console.log('refresh')" />
    <sue-qrcode :value="value" status="scanned" />
  </sue-flex>
</template>
```
