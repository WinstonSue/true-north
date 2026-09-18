# Slider with InputNumber

## Description (en-US)

Synchronize with [InputNumber](../../input-number/docs.md/) component.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref<number>(1)
const inputValueDecimal = ref<number>(0)
</script>

<template>
  <sue-space style="width: 100%" vertical>
    <sue-row>
      <sue-col :span="12">
        <sue-slider
          v-model:value="inputValue"
          :min="1"
          :max="20"
        />
      </sue-col>
      <sue-col :span="4">
        <sue-input-number
          v-model:value="inputValue"
          :min="1"
          :max="20"
          style="margin: 0 16px"
        />
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="12">
        <sue-slider
          v-model:value="inputValueDecimal"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </sue-col>
      <sue-col :span="4">
        <sue-input-number
          v-model:value="inputValueDecimal"
          :min="0"
          :max="1"
          style="margin: 0 16px"
          :step="0.01"
        />
      </sue-col>
    </sue-row>
  </sue-space>
</template>
```
