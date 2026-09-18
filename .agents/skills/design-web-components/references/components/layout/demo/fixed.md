# Fixed Header

## Description (en-US)

Sticky Header is generally used to fix the top navigation to facilitate page switching.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType, MenuItemType } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const items: MenuItemType[] = Array.from({ length: 3 }).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}))

const breadcrumbItems: BreadcrumbItemType[] = [
  { title: 'Home' },
  { title: 'List' },
  { title: 'App' },
]
</script>

<template>
  <sue-layout>
    <sue-layout-header class="demo-header">
      <div class="demo-logo" />
      <sue-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :items="items"
        class="demo-menu"
      />
    </sue-layout-header>
    <sue-layout-content class="demo-content">
      <sue-breadcrumb class="demo-breadcrumb" :items="breadcrumbItems" />
      <div
        class="demo-content-box"
        :style="{
          background: token.colorBgContainer,
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      >
        Content
      </div>
    </sue-layout-content>
    <sue-layout-footer class="demo-footer">
      Antdv Next ©{{ year }} Created by Ant UED
    </sue-layout-footer>
  </sue-layout>
</template>

<style scoped>
.demo-header {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
}

.demo-menu {
  flex: 1;
  min-width: 0;
}

.demo-content {
  padding: 0 48px;
}

.demo-breadcrumb {
  margin: 16px 0;
}

.demo-content-box {
  padding: 24px;
  min-height: 380px;
}

.demo-footer {
  text-align: center;
}

.demo-logo {
  width: 120px;
  height: 32px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
```
