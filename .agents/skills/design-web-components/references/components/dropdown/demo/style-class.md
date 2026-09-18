# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { DropdownProps, MenuItemType } from '@sue/design-web-vue'
import { ChevronDown, LogOut, Settings } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'

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

const classes: DropdownProps['classes'] = {
  root: 'demo-dropdown-root',
}

const objectStyles: DropdownProps['styles'] = {
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

const functionStyles: DropdownProps['styles'] = (info) => {
  const isClick = info.props.trigger?.includes('click')
  if (isClick) {
    return {
      root: {
        borderColor: '#1890ff',
        borderRadius: '8px',
      },
    }
  }
  return {}
}

const sharedProps: DropdownProps = {
  menu: { items },
  placement: 'bottomLeft',
  classes,
}
</script>

<template>
  <sue-flex gap="middle" wrap="wrap">
    <sue-space direction="vertical" size="large">
      <sue-dropdown v-bind="sharedProps" :styles="objectStyles">
        <sue-button>
          <sue-space>
            Object Style
            <ChevronDown />
          </sue-space>
        </sue-button>
      </sue-dropdown>

      <sue-dropdown v-bind="sharedProps" :styles="functionStyles" :trigger="['click']">
        <sue-button type="primary">
          <sue-space>
            Function Style
            <ChevronDown />
          </sue-space>
        </sue-button>
      </sue-dropdown>
    </sue-space>
  </sue-flex>
</template>

<style>
.demo-dropdown-root {
  background-color: v-bind('token.colorFillAlter');
  border: 1px solid v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
}
</style>
```
