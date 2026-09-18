# Render in current dom

## Description (en-US)

Render in current dom. custom container, check `getContainer`.

> Note: `style` and `className` props are moved to Drawer panel in v5 which is aligned with Modal component. Original `style` and `className` props are replaced by `rootStyle` and `rootClass`.

> When `getContainer` returns a DOM node, you need to manually set `rootStyle` to `{ position: 'absolute' }`.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { theme } from '@sue/design-web-vue'
import { computed, ref } from 'vue'

const { token } = theme.useToken()
const open = ref(false)

const containerStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  height: '200px',
  padding: '48px',
  overflow: 'hidden',
  background: token.value.colorFillAlter,
  border: `1px solid ${token.value.colorBorderSecondary}`,
  borderRadius: `${token.value.borderRadiusLG}px`,
}))
</script>

<template>
  <div :style="containerStyle">
    Render in this
    <div style="margin-top: 16px">
      <sue-button type="primary" @click="open = true">
        Open
      </sue-button>
    </div>
    <sue-drawer
      v-model:open="open"
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :get-container="false"
      @close="open = false"
    >
      <p>Some contents...</p>
    </sue-drawer>
  </div>
</template>
```
