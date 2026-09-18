# Responsive

## Description (en-US)

sue-layout-sider supports responsive layout.

> Note: You can get a responsive layout by setting `breakpoint`. The Sider will collapse to the width of `collapsedWidth` when window width is below the `breakpoint`. A special trigger will appear if `collapsedWidth` is set to 0.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { Menu, Upload, User, Video } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const items: MenuItemType[] = [User, Video, Upload, User].map(
  (icon, index) => ({
    key: String(index + 1),
    icon,
    label: `nav ${index + 1}`,
  }),
)

function handleBreakpoint(broken: boolean) {
  console.log(broken)
}

function handleCollapse(collapsed: boolean, type: string) {
  console.log(collapsed, type)
}
</script>

<template>
  <sue-layout>
    <sue-layout-sider
      breakpoint="lg"
      :collapsed-width="0"
      @breakpoint="handleBreakpoint"
      @collapse="handleCollapse"
    >
      <template #trigger>
        <Menu />
      </template>
      <div class="demo-logo-vertical" />
      <sue-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['4']"
        :items="items"
      />
    </sue-layout-sider>
    <sue-layout>
      <sue-layout-header class="responsive-header" :style="{ background: token.colorBgContainer }" />
      <sue-layout-content class="responsive-content">
        <div
          class="responsive-content-box"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          content
        </div>
      </sue-layout-content>
      <sue-layout-footer class="responsive-footer">
        Antdv Next ©{{ year }} Created by Ant UED
      </sue-layout-footer>
    </sue-layout>
  </sue-layout>
</template>

<style scoped>
.responsive-header {
  padding: 0;
}

.responsive-content {
  margin: 24px 16px 0;
}

.responsive-content-box {
  padding: 24px;
  min-height: 360px;
}

.responsive-footer {
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
