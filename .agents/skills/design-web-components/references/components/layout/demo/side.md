# Sider

## Description (en-US)

Two-columns layout. The sider menu can be collapsed when horizontal space is limited.

Generally, the mainnav is placed on the left side of the page, and the secondary menu is placed on the top of the working area. Contents will adapt the layout to the viewing area to improve the horizontal space usage, while the layout of the whole page is not stable.

The level of the aside navigation is scalable. The first, second, and third level navigations could be present more fluently and relevantly, and aside navigation can be fixed, allowing the user to quickly switch and spot the current position, improving the user experience. However, this navigation occupies some horizontal space of the contents.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType, MenuItemType } from '@sue/design-web-vue'
import { Monitor, File, ChevronLeft, ChartPie, ChevronRight, Users, User } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'
import { ref } from 'vue'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const collapsed = ref(false)

const items: MenuItemType[] = [
  { key: '1', icon: ChartPie, label: 'Option 1' },
  { key: '2', icon: Monitor, label: 'Option 2' },
  {
    key: 'sub1',
    icon: User,
    label: 'User',
    children: [
      { key: '3', label: 'Tom' },
      { key: '4', label: 'Bill' },
      { key: '5', label: 'Alex' },
    ],
  },
  {
    key: 'sub2',
    icon: Users,
    label: 'Team',
    children: [
      { key: '6', label: 'Team 1' },
      { key: '8', label: 'Team 2' },
    ],
  },
  { key: '9', icon: File, label: 'Files' },
]

const breadcrumbItems: BreadcrumbItemType[] = [
  { title: 'User' },
  { title: 'Bill' },
]
</script>

<template>
  <sue-layout class="side-layout">
    <sue-layout-sider v-model:collapsed="collapsed" collapsible>
      <template #trigger>
        <ChevronRight v-if="collapsed" />
        <ChevronLeft v-else />
      </template>
      <div class="demo-logo-vertical" />
      <sue-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['1']"
        :items="items"
      />
    </sue-layout-sider>
    <sue-layout>
      <sue-layout-header class="side-header" :style="{ background: token.colorBgContainer }" />
      <sue-layout-content class="side-content">
        <sue-breadcrumb class="side-breadcrumb" :items="breadcrumbItems" />
        <div
          class="side-content-box"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          Bill is a cat.
        </div>
      </sue-layout-content>
      <sue-layout-footer class="side-footer">
        Antdv Next ©{{ year }} Created by Ant UED
      </sue-layout-footer>
    </sue-layout>
  </sue-layout>
</template>

<style scoped>
.side-layout {
  min-height: 100vh;
}

.side-header {
  padding: 0;
}

.side-content {
  margin: 0 16px;
}

.side-breadcrumb {
  margin: 16px 0;
}

.side-content-box {
  padding: 24px;
  min-height: 360px;
}

.side-footer {
  text-align: center;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
```
