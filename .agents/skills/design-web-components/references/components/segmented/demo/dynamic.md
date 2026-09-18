# Dynamic

## Description (en-US)

Load options dynamically.

## Source

```vue
<script lang="ts" setup>
import { reactive, ref } from 'vue'

const data = reactive(['Daily', 'Weekly', 'Monthly'])
const isDisabled = ref(false)
function loadMore() {
  data.push(...['Quarterly', 'Yearly'])
  isDisabled.value = true
};
const value = ref(data[0])
</script>

<template>
  <sue-segmented v-model:value="value" :options="data" />
  <br>
  <br>
  <sue-button type="primary" :disabled="isDisabled" @click="loadMore">
    Load More
  </sue-button>
</template>
```
