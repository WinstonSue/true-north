# basic

## Description (en-US)

The basic usage.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref } from 'vue'

const value = ref('horizontal')
const baseStyle: CSSProperties = {
  width: '25%',
  height: '54px',
}
</script>

<template>
  <sue-flex gap="middle" vertical>
    <sue-radio-group v-model:value="value">
      <sue-radio value="horizontal">
        horizontal
      </sue-radio>
      <sue-radio value="vertical">
        vertical
      </sue-radio>
    </sue-radio-group>
    <sue-flex :vertical="value === 'vertical'">
      <div
        v-for="(item, index) in new Array(4)"
        :key="item"
        :style="{ ...baseStyle, background: `${index % 2 ? '#1677ff' : '#1677ffbf'}` }"
      />
    </sue-flex>
  </sue-flex>
</template>
```
