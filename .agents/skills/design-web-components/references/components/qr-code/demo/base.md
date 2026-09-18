# base

## Description (en-US)

Basic Usage.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.@sue/design-web-vue.com')
</script>

<template>
  <sue-space direction="vertical" align="center">
    <sue-qrcode :value="text || '-'" />
    <sue-input v-model:value="text" placeholder="-" :maxlength="60" />
  </sue-space>
</template>
```
