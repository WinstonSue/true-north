# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { PopconfirmProps } from '@sue/design-web-vue'

const classes: PopconfirmProps['classes'] = {
  container: 'demo-popconfirm-container',
}

const stylesObject: PopconfirmProps['styles'] = {
  container: {
    backgroundColor: '#eee',
    boxShadow: 'inset 5px 5px 3px #fff, inset -5px -5px 3px #ddd, 0 0 3px rgba(0,0,0,0.2)',
  },
  title: {
    color: '#262626',
  },
  content: {
    color: '#262626',
  },
}

const stylesFn: PopconfirmProps['styles'] = (info) => {
  if (info?.props?.arrow === false) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        borderRadius: '4px',
      },
      title: {
        color: '#fff',
      },
      content: {
        color: '#fff',
      },
    }
  }
  return {}
}
</script>

<template>
  <sue-flex gap="middle">
    <sue-popconfirm
      title="Object text"
      description="Object description"
      :classes="classes"
      :styles="stylesObject"
      :arrow="false"
    >
      <sue-button>Object Style</sue-button>
    </sue-popconfirm>
    <sue-popconfirm
      title="Function text"
      description="Function description"
      :classes="classes"
      :styles="stylesFn"
      :arrow="false"
      :ok-button-props="{ styles: { root: { backgroundColor: 'rgba(53, 71, 125, 0.6)', color: '#fff' } } }"
      :cancel-button-props="{ styles: { root: { borderColor: 'rgba(53, 71, 125, 0.6)', backgroundColor: '#fff', color: 'rgba(53, 71, 125, 0.8)' } } }"
    >
      <sue-button type="primary">
        Function Style
      </sue-button>
    </sue-popconfirm>
  </sue-flex>
</template>

<style>
.demo-popconfirm-container {
  padding: 10px;
}
</style>
```
