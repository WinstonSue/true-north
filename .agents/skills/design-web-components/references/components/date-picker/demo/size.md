# Three Sizes

## Description (en-US)

The input box comes in three sizes: small, medium and large. The `medium` size will be used if `size` is omitted.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type SizeType = 'large' | 'medium' | 'small'

const size = shallowRef<SizeType>('medium')
</script>

<template>
  <sue-space vertical :size="12">
    <sue-radio-group v-model:value="size">
      <sue-radio-button value="large">
        Large
      </sue-radio-button>
      <sue-radio-button value="medium">
      medium
    </sue-radio-button>
      <sue-radio-button value="small">
        Small
      </sue-radio-button>
    </sue-radio-group>
    <sue-date-picker :size="size" />
    <sue-date-picker :size="size" picker="month" />
    <sue-range-picker :size="size" />
    <sue-date-picker :size="size" picker="week" />
  </sue-space>
</template>
```
