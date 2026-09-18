# Custom semantic dom styling

## Description (en-US)

You can customize the semantic dom style of Select by passing objects/functions through `classes` and `styles`.

## Source

```vue
<script setup lang="ts">
import { Meh } from '@lucide/vue'

const options = [
  { value: 'GuangZhou', label: 'GuangZhou' },
  { value: 'ShenZhen', label: 'ShenZhen' },
]

const stylesObject = {
  prefix: {
    color: '#1890ff',
  },
  suffix: {
    color: '#1890ff',
  },
}

const stylesFilled = {
  prefix: {
    color: '#722ed1',
  },
  suffix: {
    color: '#722ed1',
  },
  popup: {
    root: {
      border: '1px solid #722ed1',
    },
  },
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-select
      :options="options"
      :classes="{ root: 'custom-select' }"
      :styles="stylesObject"
      placeholder="Object"
    >
      <template #prefix>
        <Meh />
      </template>
    </sue-select>
    <sue-select
      :options="options"
      :classes="{ root: 'custom-select' }"
      :styles="stylesFilled"
      placeholder="Function"
      variant="filled"
    >
      <template #prefix>
        <Meh />
      </template>
    </sue-select>
  </sue-flex>
</template>

<style>
.custom-select {
  border-radius: 8px;
  width: 300px;
}
</style>
```
