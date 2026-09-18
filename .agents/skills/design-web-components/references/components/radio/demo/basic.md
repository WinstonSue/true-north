# Basic

## Description (en-US)

The simplest use.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const val = shallowRef()
</script>

<template>
  <sue-radio v-model:checked="val">
    Radio
  </sue-radio>
</template>
```
