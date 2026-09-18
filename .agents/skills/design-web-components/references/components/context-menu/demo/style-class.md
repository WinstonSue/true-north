# Custom semantic dom styling

## Description (en-US)

You can customize the [semantic dom](#semantic-dom) style of the ContextMenu by passing objects/functions through `classes` and `styles`.

## Source

```vue
<script setup lang="ts">
import type { ContextMenuProps, MenuItemType } from '@sue/design-web-vue'
import { LogOut, Settings } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'
import { computed } from 'vue'

const { token } = theme.useToken()

const items: MenuItemType[] = [
  {
    key: '1',
    label: 'Profile',
  },
  {
    key: '2',
    label: 'Settings',
    icon: Settings,
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: 'Logout',
    icon: LogOut,
    danger: true,
  },
]

const classes: ContextMenuProps['classes'] = {
  root: 'demo-context-menu-root',
}

const objectStyles: ContextMenuProps['styles'] = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  item: {
    padding: '8px 12px',
    fontSize: '14px',
  },
  itemTitle: {
    fontWeight: '500',
  },
  itemIcon: {
    color: '#1890ff',
    marginRight: '8px',
  },
  itemContent: {
    backgroundColor: 'transparent',
  },
}

const functionStyles: ContextMenuProps['styles'] = () => ({
  root: {
    borderColor: '#1890ff',
    borderRadius: '8px',
  },
})

const sharedProps: ContextMenuProps = {
  menu: { items },
  placement: 'bottomLeft',
  classes,
}

const areaStyle = computed(() => ({
  color: token.value.colorTextTertiary,
  background: token.value.colorBgLayout,
  height: '80px',
  textAlign: 'center' as const,
  lineHeight: '80px',
}))
</script>

<template>
  <sue-flex gap="middle" wrap="wrap">
    <sue-space direction="vertical" size="large">
      <sue-context-menu v-bind="sharedProps" :styles="objectStyles">
        <div :style="areaStyle">
          Object Style
        </div>
      </sue-context-menu>

      <sue-context-menu v-bind="sharedProps" :styles="functionStyles">
        <div :style="areaStyle">
          Function Style
        </div>
      </sue-context-menu>
    </sue-space>
  </sue-flex>
</template>

<style>
.demo-context-menu-root {
  background-color: v-bind('token.colorFillAlter');
  border: 1px solid v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
}
</style>
```
