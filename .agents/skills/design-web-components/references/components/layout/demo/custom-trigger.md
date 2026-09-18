# Custom trigger

## Description (en-US)

If you want to use a customized trigger, you can hide the default one.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { PanelLeftClose, PanelLeftOpen, Upload, User, Video } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'
import { ref } from 'vue'

const { token } = theme.useToken()

const collapsed = ref(false)

const items: MenuItemType[] = [
  { key: '1', icon: User, label: 'nav 1' },
  { key: '2', icon: Video, label: 'nav 2' },
  { key: '3', icon: Upload, label: 'nav 3' },
]

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <sue-layout>
    <sue-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="demo-logo-vertical" />
      <sue-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['1']"
        :items="items"
      />
    </sue-layout-sider>
    <sue-layout>
      <sue-layout-header class="custom-header" :style="{ background: token.colorBgContainer }">
        <sue-button type="text" class="trigger-button" @click="toggleCollapsed">
          <template #icon>
            <PanelLeftOpen v-if="collapsed" />
            <PanelLeftClose v-else />
          </template>
        </sue-button>
      </sue-layout-header>
      <sue-layout-content
        class="custom-content"
        :style="{
          background: token.colorBgContainer,
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      >
        Content
      </sue-layout-content>
    </sue-layout>
  </sue-layout>
</template>

<style scoped>
.custom-header {
  padding: 0;
}

.custom-content {
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
}

.trigger-button {
  width: 64px;
  height: 64px;
  font-size: 16px;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
```
