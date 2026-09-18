# Component Token

## Description (en-US)

Component Token Debug.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(2.5)
</script>

<template>
  <sue-config-provider
    :theme="{
      components: {
        Rate: {
          starColor: 'blue',
          starSize: 40,
          starHoverScale: 'scale(2)',
          starBg: 'red',
        },
      },
    }"
  >
    <sue-rate v-model:value="value" allow-half />
  </sue-config-provider>
</template>
```
