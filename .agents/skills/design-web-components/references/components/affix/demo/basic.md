# Basic

## Description (en-US)

The simplest usage.

## Source

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const top = ref(100)
const bottom = ref(100)
</script>

<template>
  <sue-affix :offset-top="top">
    <sue-button type="primary" @click="() => top = top + 10">
      Affix top
    </sue-button>
  </sue-affix>
  <br>
  <sue-affix :offset-bottom="bottom">
    <sue-button type="primary" @click="() => bottom = bottom + 10">
      Affix bottom
    </sue-button>
  </sue-affix>
</template>
```
