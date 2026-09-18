# Other Character

## Description (en-US)

Replace the default star to other character like alphabet, digit, iconfont or even Chinese word.

## Source

```vue
<script lang="ts" setup>
import { Heart } from '@lucide/vue'
import { h, ref } from 'vue'

const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-rate v-model:value="value1" :character="h(Heart)" allow-half />
    <sue-rate v-model:value="value2" character="A" allow-half style="font-size: 36px" />
    <sue-rate v-model:value="value3" character="好" allow-half />
  </sue-flex>
</template>
```
