# Button with dropdown menu

## Description (en-US)

A button is on the left, and a related functional menu is on the right. You can set the icon property to modify the icon of right.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { ChevronDown, Ellipsis, User } from '@lucide/vue'
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

function handleButtonClick(e: MouseEvent) {
  messageApi.info('Click on left button.')
  console.log('click left button', e)
}

function handleMenuClick(e: any) {
  messageApi.info('Click on menu item.')
  console.log('click', e)
}

const items: MenuItemType[] = [
  {
    label: '1st menu item',
    key: '1',
    icon: User,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: User,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: User,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: User,
    danger: true,
    disabled: true,
  },
]

const menuProps = {
  items,
  onClick: handleMenuClick,
}
</script>

<template>
  <ContextHolder />
  <sue-space wrap>
    <sue-space-compact>
      <sue-button @click="handleButtonClick">
        Dropdown
      </sue-button>
      <sue-dropdown :menu="menuProps" placement="bottomRight">
        <sue-button>
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>

    <sue-space-compact>
      <sue-button @click="handleButtonClick">
        Dropdown
      </sue-button>
      <sue-dropdown :menu="menuProps" placement="bottomRight">
        <sue-button>
          <template #icon>
            <User />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>

    <sue-space-compact>
      <sue-button disabled @click="handleButtonClick">
        Dropdown
      </sue-button>
      <sue-dropdown :menu="menuProps" placement="bottomRight" disabled>
        <sue-button disabled>
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>

    <sue-space-compact>
      <sue-tooltip title="tooltip">
        <sue-button @click="handleButtonClick">
          With Tooltip
        </sue-button>
      </sue-tooltip>
      <sue-dropdown :menu="menuProps" placement="bottomRight">
        <sue-button loading />
      </sue-dropdown>
    </sue-space-compact>

    <sue-dropdown :menu="menuProps">
      <sue-button icon-placement="end" @click="handleButtonClick">
        <template #icon>
          <ChevronDown />
        </template>
        Button
      </sue-button>
    </sue-dropdown>

    <sue-space-compact>
      <sue-button danger @click="handleButtonClick">
        Danger
      </sue-button>
      <sue-dropdown :menu="menuProps" placement="bottomRight">
        <sue-button danger>
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>
  </sue-space>
</template>
```
