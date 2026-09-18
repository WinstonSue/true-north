# Compact Style

## Description (en-US)

Use Space.Compact create compact style, See the [Space.Compact](../../space/docs.md#spacecompact) documentation for more.

## Source

```vue
<script setup lang="ts">
import { Search } from '@lucide/vue'

// const options = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//   },
// ]
</script>

<template>
  <sue-space direction="vertical" size="medium">
    <sue-space-compact>
      <sue-input default-value="26888888" />
    </sue-space-compact>
    <sue-space-compact>
      <sue-input style="width: 20%;" default-value="0571" />
      <sue-input style="width: 80%;" default-value="26888888" />
    </sue-space-compact>
    <sue-space-compact>
      <sue-space-addon>https://</sue-space-addon>
      <sue-input-search placeholder="input search text" allow-clear />
    </sue-space-compact>
    <sue-space-compact style="width: 100%;">
      <sue-input default-value="Combine input and button" />
      <sue-button type="primary">
        Submit
      </sue-button>
    </sue-space-compact>
    <!-- <sue-space-compact>
      <sue-select default-value="Zhejiang" :options="options" />
      <sue-input default-value="Xihu District, Hangzhou" />
    </sue-space-compact> -->
    <sue-space-compact size="large">
      <sue-space-addon>
        <Search />
      </sue-space-addon>
      <sue-input placeholder="large size" />
      <sue-input placeholder="another input" />
    </sue-space-compact>
  </sue-space>
</template>
```
