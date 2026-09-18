# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

interface Option {
  value: string
  label: string
  children?: Option[]
}

const placement = shallowRef<Placement>('topLeft')

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
</script>

<template>
  <sue-radio-group v-model:value="placement">
    <sue-radio-button value="topLeft">
      topLeft
    </sue-radio-button>
    <sue-radio-button value="topRight">
      topRight
    </sue-radio-button>
    <sue-radio-button value="bottomLeft">
      bottomLeft
    </sue-radio-button>
    <sue-radio-button value="bottomRight">
      bottomRight
    </sue-radio-button>
  </sue-radio-group>
  <br>
  <br>
  <sue-cascader :options="options" placeholder="Please select" :placement="placement" />
</template>
```
