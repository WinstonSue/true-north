# Custom Panel

## Description (en-US)

Customize the background, border, margin styles and icon for each panel.

## Source

```vue
<script setup lang="ts">
import type { CollapseProps } from '@sue/design-web-vue'
import type { CSSProperties } from 'vue'
import { ChevronRight } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'
import { computed, h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const { token } = theme.useToken()

const panelStyle = computed<CSSProperties>(() => ({
  marginBottom: '24px',
  background: token.colorFillAlter,
  borderRadius: token.borderRadiusLG,
  border: 'none',
}))

const items = computed(() => [
  {
    key: '1',
    label: 'This is panel header 1',
    content: h('p', text),
    style: panelStyle.value,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: h('p', text),
    style: panelStyle.value,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: h('p', text),
    style: panelStyle.value,
  },
])

const expandIcon: CollapseProps['expandIcon'] = (panelProps) => {
  return h(ChevronRight, { rotate: panelProps.isActive ? 90 : 0 })
}
</script>

<template>
  <sue-collapse
    :items="items"
    :bordered="false"
    :default-active-key="['1']"
    :expand-icon="expandIcon"
    :style="{ background: token.colorBgContainer }"
  />
</template>
```
