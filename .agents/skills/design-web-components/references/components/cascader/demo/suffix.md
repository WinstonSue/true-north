# Prefix and Suffix

## Description (en-US)

Use `prefix` to customize the prefix content, use `suffixIcon` to customize the selection box suffix icon, and use `expandIcon` to customize the current item expand icon.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from '@sue/design-web-vue'
import { Smile } from '@lucide/vue'
import { h } from 'vue'

interface Option {
  value: string
  label: string
  children?: Option[]
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}

const prefixIcon = h(Smile)
</script>

<template>
  <sue-cascader
    :options="options"
    placeholder="Please select"
    @change="onChange"
  >
    <template #suffixIcon>
      <Smile />
    </template>
  </sue-cascader>
  <br>
  <br>
  <sue-cascader
    suffix-icon="ab"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
  <br>
  <br>
  <sue-cascader
    :options="options"
    placeholder="Please select"
    @change="onChange"
  >
    <template #expandIcon>
      <Smile />
    </template>
  </sue-cascader>
  <br>
  <br>
  <sue-cascader
    expand-icon="ab"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
  <br>
  <br>
  <sue-cascader
    :prefix="prefixIcon"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
</template>
```
