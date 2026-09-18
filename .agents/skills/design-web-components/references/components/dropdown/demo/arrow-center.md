# Arrow pointing at the center

## Description (en-US)

Set `arrow` with `pointAtCenter: true`, the arrow will point to the center of the target element.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'

const items: MenuItemType[] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item',
  },
  {
    key: '3',
    label: '3rd menu item',
  },
]

const href: Record<string, string> = {
  1: 'https://www.antgroup.com',
  2: 'https://www.aliyun.com',
  3: 'https://www.luohanacademy.com',
}
</script>

<template>
  <sue-space direction="vertical">
    <sue-space wrap>
      <sue-dropdown :menu="{ items }" placement="bottomLeft" :arrow="{ pointAtCenter: true }">
        <sue-button>bottomLeft</sue-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </sue-dropdown>
      <sue-dropdown :menu="{ items }" placement="bottom" :arrow="{ pointAtCenter: true }">
        <sue-button>bottom</sue-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </sue-dropdown>
      <sue-dropdown :menu="{ items }" placement="bottomRight" :arrow="{ pointAtCenter: true }">
        <sue-button>bottomRight</sue-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </sue-dropdown>
    </sue-space>
    <sue-space wrap>
      <sue-dropdown :menu="{ items }" placement="topLeft" :arrow="{ pointAtCenter: true }">
        <sue-button>topLeft</sue-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </sue-dropdown>
      <sue-dropdown :menu="{ items }" placement="top" :arrow="{ pointAtCenter: true }">
        <sue-button>top</sue-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </sue-dropdown>
      <sue-dropdown :menu="{ items }" placement="topRight" :arrow="{ pointAtCenter: true }">
        <sue-button>topRight</sue-button>
        <template #labelRender="item">
          <a
            v-if="item && ['1', '2', '3'].includes(item.key as string)"
            target="_blank"
            rel="noopener noreferrer"
            :href="href[item.key as string]"
          >
            {{ item?.label }}
          </a>
        </template>
      </sue-dropdown>
    </sue-space>
  </sue-space>
</template>
```
