# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { DrawerProps } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'
import { ref } from 'vue'

const { token } = theme.useToken()
const open = ref(false)
const openFn = ref(false)

const classes: DrawerProps['classes'] = {
  header: 'demo-drawer-header',
  body: 'demo-drawer-body',
}

const stylesObject: DrawerProps['styles'] = {
  body: {
    backgroundColor: '#f5f5f5',
  },
}

const stylesFn: DrawerProps['styles'] = (info) => {
  if (info?.props?.placement === 'right') {
    return {
      mask: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      wrapper: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    }
  }
  return {}
}
</script>

<template>
  <sue-flex gap="middle">
    <sue-button @click="open = true">
      Object Style
    </sue-button>
    <sue-button type="primary" @click="openFn = true">
      Function Style
    </sue-button>
  </sue-flex>

  <sue-drawer
    v-model:open="open"
    title="Custom Style Drawer"
    :classes="classes"
    :styles="stylesObject"
    @close="open = false"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </sue-drawer>

  <sue-drawer
    v-model:open="openFn"
    title="Custom Function Drawer"
    :classes="classes"
    :styles="stylesFn"
    @close="openFn = false"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </sue-drawer>
</template>

<style scoped>
.demo-drawer-header {
  border-bottom: 1px dashed v-bind('token.colorBorder');
}

.demo-drawer-body {
  border-top: 1px dashed v-bind('token.colorBorder');
}
</style>
```
