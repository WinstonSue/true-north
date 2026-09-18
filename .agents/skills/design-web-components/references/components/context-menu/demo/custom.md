# Custom dropdown

## Description (en-US)

Customize the context menu via `popupRender`. If you don't need the Menu content, use the Popover component directly.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'
import { computed } from 'vue'

const items: MenuItemType[] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item (disabled)',
    disabled: true,
  },
  {
    key: '3',
    label: '3rd menu item (disabled)',
    disabled: true,
  },
]

const { token } = theme.useToken()

const contentStyle = computed(() => ({
  backgroundColor: token.value.colorBgElevated,
  borderRadius: token.value.borderRadiusLG,
  boxShadow: token.value.boxShadowSecondary,
}))

const menuStyle = {
  boxShadow: 'none',
}

const areaStyle = computed(() => ({
  color: token.value.colorTextTertiary,
  background: token.value.colorBgLayout,
  height: '200px',
  textAlign: 'center',
  lineHeight: '200px',
}))
</script>

<template>
  <sue-context-menu :menu="{ items }">
    <template #popupRender="menu">
      <div :style="contentStyle">
        <component :is="menu" :style="menuStyle" />
        <sue-divider style="margin: 0" />
        <sue-space style="padding: 8px">
          <sue-button type="primary">
            Click me!
          </sue-button>
        </sue-space>
      </div>
    </template>
    <div :style="areaStyle">
      Right Click on here
    </div>
  </sue-context-menu>
</template>
```
