# Fixed Sider

## Description (en-US)

When dealing with long content, a sticky sider can provide a better user experience.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import type { CSSProperties } from 'vue'
import { LayoutGrid, ChartColumn, Cloud, Store, Users, Upload, User, Video } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const siderStyle: CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
}

const items: MenuItemType[] = [
  User,
  Video,
  Upload,
  ChartColumn,
  Cloud,
  LayoutGrid,
  Users,
  Store,
].map((icon, index) => ({
  key: String(index + 1),
  icon,
  label: `nav ${index + 1}`,
}))
</script>

<template>
  <sue-layout :has-sider="true">
    <sue-layout-sider :style="siderStyle">
      <div class="demo-logo-vertical" />
      <sue-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['4']"
        :items="items"
      />
    </sue-layout-sider>
    <sue-layout>
      <sue-layout-header class="fixed-header" :style="{ background: token.colorBgContainer }" />
      <sue-layout-content class="fixed-content">
        <div
          class="fixed-content-box"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          <p>long content</p>
          <template v-for="index in 100" :key="index">
            {{ index % 20 === 0 && index !== 0 ? 'more' : '...' }}
            <br>
          </template>
        </div>
      </sue-layout-content>
      <sue-layout-footer class="fixed-footer">
        Antdv Next ©{{ year }} Created by Ant UED
      </sue-layout-footer>
    </sue-layout>
  </sue-layout>
</template>

<style scoped>
.fixed-header {
  padding: 0;
}

.fixed-content {
  margin: 24px 16px 0;
  overflow: initial;
}

.fixed-content-box {
  padding: 24px;
  text-align: center;
}

.fixed-footer {
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
