# Panel

## Description (en-US)

Used for inline view case.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from '@sue/design-web-vue'
import { ref } from 'vue'

interface Option {
  value: string | number
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

const disabled = ref(false)

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}

const onMultipleChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}
</script>

<template>
  <sue-flex vertical gap="small" align="flex-start">
    <sue-switch
      v-model:checked="disabled"
      checked-children="Enabled"
      un-checked-children="Disabled"
      aria-label="disabled switch"
    />
    <sue-cascader-panel :options="options" :disabled="disabled" @change="onChange" />
    <sue-cascader-panel multiple :options="options" :disabled="disabled" @change="onMultipleChange" />
    <sue-cascader-panel />
  </sue-flex>
</template>
```
