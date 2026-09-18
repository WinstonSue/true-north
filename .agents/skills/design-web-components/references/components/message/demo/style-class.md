# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

const defaultStyles: Record<string, CSSProperties> = {
  root: {
    backgroundColor: '#f6ffed',
    border: '2px solid #95de64',
    borderRadius: '16px',
    boxShadow: '4px 4px 0 #d9f7be',
  },
  icon: {
    color: '#237804',
  },
  title: {
    color: '#237804',
    fontWeight: 600,
  },
}

function stylesFn(info: { props: any }): Record<string, CSSProperties> {
  if (info.props.type === 'error') {
    return {
      root: {
        ...defaultStyles.root,
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7',
        boxShadow: '4px 4px 0 #ffccc7',
      },
      icon: {
        color: '#cf1322',
      },
      title: {
        color: '#cf1322',
        fontWeight: 600,
      },
    }
  }
  return defaultStyles
}

function showObjectStyle() {
  messageApi.open({
    type: 'success',
    content: 'This is a message with object styles',
    styles: defaultStyles,
  })
}

function showFunctionStyle() {
  messageApi.open({
    type: 'error',
    content: 'This is a message with function styles',
    styles: stylesFn as any,
  })
}
</script>

<template>
  <ContextHolder />
  <sue-space>
    <sue-button @click="showObjectStyle">
      Object style
    </sue-button>
    <sue-button type="primary" @click="showFunctionStyle">
      Function style
    </sue-button>
  </sue-space>
</template>
```
