# Compact Mode for form component

## Description (en-US)

Compact layout component, suitable for combining input boxes, selectors and other components.

## Source

```vue
<script setup lang="ts">
import { Copy } from '@lucide/vue'
import { ref } from 'vue'

const zhejiangJiangsuOptions = [
  { label: 'Zhejiang', value: 'Zhejiang' },
  { label: 'Jiangsu', value: 'Jiangsu' },
]

const option12Options = [
  { label: 'Option1', value: 'Option1' },
  { label: 'Option2', value: 'Option2' },
]

const option11Options = [
  { label: 'Option1-1', value: 'Option1-1' },
  { label: 'Option1-2', value: 'Option1-2' },
]

const option22Options = [
  { label: 'Option2-1', value: 'Option2-1' },
  { label: 'Option2-2', value: 'Option2-2' },
]

const betweenExceptOptions = [
  { label: 'Between', value: '1' },
  { label: 'Except', value: '2' },
]

const signOptions = [
  { label: 'Sign Up', value: 'Sign Up' },
  { label: 'Sign In', value: 'Sign In' },
]

const emailOptions = [{ value: 'text 1' }, { value: 'text 2' }]

const addressOptions = [
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

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          { value: 'leaf1', title: 'leaf1' },
          { value: 'leaf2', title: 'leaf2' },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          { value: 'leaf3', title: 'leaf3' },
        ],
      },
    ],
  },
]

const value = ref('leaf1')
</script>

<template>
  <sue-space orientation="vertical">
    <sue-space-compact block>
      <sue-input style="width: 20%" default-value="0571" />
      <sue-input style="width: 30%" default-value="26888888" />
    </sue-space-compact>
    <sue-space-compact block size="small">
      <sue-input style="width: calc(100% - 200px)" default-value="https://ant.design" />
      <sue-button type="primary">
        Submit
      </sue-button>
    </sue-space-compact>
    <sue-space-compact block>
      <sue-input style="width: calc(100% - 200px)" default-value="https://ant.design" />
      <sue-button type="primary">
        Submit
      </sue-button>
    </sue-space-compact>
    <sue-space-compact block>
      <sue-input
        style="width: calc(100% - 200px)"
        default-value="git@git.internal.example:design-web.git"
      />
      <sue-tooltip title="copy git url">
        <sue-button>
          <template #icon>
            <Copy />
          </template>
        </sue-button>
      </sue-tooltip>
    </sue-space-compact>
    <sue-space-compact block>
      <sue-select
        allow-clear
        default-value="Zhejiang"
        :options="zhejiangJiangsuOptions"
      />
      <sue-input style="width: 50%" default-value="Xihu District, Hangzhou" />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-select
        allow-clear
        mode="multiple"
        default-value="Zhejiang"
        style="width: 50%"
        :options="zhejiangJiangsuOptions"
      />
      <sue-input style="width: 50%" default-value="Xihu District, Hangzhou" />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-input-search style="width: 30%" default-value="0571" />
      <sue-input-search allow-clear style="width: 50%" default-value="26888888" />
      <sue-input-search style="width: 20%" default-value="+1" />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-select
        default-value="Option1"
        :options="option12Options"
      />
      <sue-input style="width: 50%" default-value="input content" />
      <sue-input-number :default-value="12" />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-input style="width: 50%" default-value="input content" />
      <sue-date-picker style="width: 50%" />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-range-picker style="width: 70%" />
      <sue-input style="width: 30%" default-value="input content" />
      <sue-button type="primary">
        查询
      </sue-button>
    </sue-space-compact>
    <sue-space-compact block>
      <sue-input style="width: 30%" default-value="input content" />
      <sue-range-picker style="width: 70%" />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-select
        default-value="Option1-1"
        :options="option11Options"
      />
      <sue-select
        default-value="Option2-2"
        :options="option22Options"
      />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-select
        default-value="1"
        :options="betweenExceptOptions"
      />
      <sue-input style="width: 100px; text-align: center" placeholder="Minimum" />
      <sue-input
        class="site-input-split"
        style="width: 30px; border-inline-start: 0; border-inline-end: 0; pointer-events: none"
        placeholder="~"
        disabled
      />
      <sue-input
        class="site-input-right"
        style="width: 100px; text-align: center"
        placeholder="Maximum"
      />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-select
        default-value="Sign Up"
        style="width: 30%"
        :options="signOptions"
      />
      <sue-auto-complete
        style="width: 70%"
        placeholder="Email"
        :options="emailOptions"
      />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-time-picker style="width: 70%" />
      <sue-cascader
        style="width: 70%"
        :options="addressOptions"
        placeholder="Select Address"
      />
    </sue-space-compact>
    <sue-space-compact block>
      <sue-time-range-picker />
      <sue-tree-select
        v-model:value="value"
        show-search
        style="width: 60%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="Please select"
        allow-clear
        tree-default-expand-all
        :tree-data="treeData"
      >
        <template #title="{ value: val, title }">
          <b v-if="val === 'leaf3'" style="color: #08c">{{ title }}</b>
          <template v-else>
            {{ title }}
          </template>
        </template>
      </sue-tree-select>
      <sue-button type="primary">
        Submit
      </sue-button>
    </sue-space-compact>
    <sue-space-compact>
      <sue-input placeholder="input here" />
      <sue-space-addon>$</sue-space-addon>
      <sue-input-number placeholder="another input" style="width: 100%" />
      <sue-input-number placeholder="another input" style="width: 100%" />
      <sue-space-addon>$</sue-space-addon>
    </sue-space-compact>
    <sue-space-compact>
      <sue-input placeholder="input here" />
      <sue-color-picker />
    </sue-space-compact>
    <sue-space-compact>
      <sue-button type="primary">
        Button
      </sue-button>
      <sue-input placeholder="input here" />
      <sue-space-addon>$</sue-space-addon>
    </sue-space-compact>
  </sue-space>
</template>
```
