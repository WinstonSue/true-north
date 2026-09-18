# Size

## Description (en-US)

Cascade selection box of different sizes.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from '@sue/design-web-vue'

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
</script>

<template>
  <sue-cascader size="large" :options="options" @change="onChange" />
  <br>
  <br>
  <sue-cascader :options="options" @change="onChange" />
  <br>
  <br>
  <sue-cascader size="small" :options="options" @change="onChange" />
  <br>
  <br>
</template>
```
