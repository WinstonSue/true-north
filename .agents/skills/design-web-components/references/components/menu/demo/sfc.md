# SFC Mode (Nested)

## Description (en-US)

Build an SFC menu with declarative `sue-menu-item` and `sue-sub-menu`, equivalent to the `items` structure.

## Source

```vue
<script setup lang="ts">
import { LayoutGrid, Calendar, Link, Mail, Settings } from '@lucide/vue'
import { computed, ref, shallowRef, watch } from 'vue'

const mode = ref<'vertical' | 'inline'>('inline')
const theme = ref<'dark' | 'light'>('light')
const collapsed = ref(false)
const openKeys = ref<string[]>(['sub1'])
const cachedOpenKeys = ref<string[]>(['sub1'])
const inlineCollapsed = computed(() => mode.value === 'inline' && collapsed.value)
const expandAllChecked = computed(() => !collapsed.value && openKeys.value.length > 0)

watch(openKeys, (keys) => {
  if (!collapsed.value) {
    cachedOpenKeys.value = [...keys]
  }
}, { deep: true })

function changeExpanded(value: boolean) {
  if (collapsed.value) {
    return
  }

  openKeys.value = value ? ['sub1', 'sub1-2', 'sub2'] : []
}

function changeCollapsed(value: boolean) {
  collapsed.value = value
  if (value) {
    openKeys.value = []
  }
  else {
    openKeys.value = [...cachedOpenKeys.value]
  }
}

function changeMode(value: boolean) {
  mode.value = value ? 'vertical' : 'inline'
}

function changeTheme(value: boolean) {
  theme.value = value ? 'dark' : 'light'
}
const selectedKeys = shallowRef(['1'])
</script>

<template>
  <sue-switch :checked="mode === 'vertical'" @change="changeMode" />
  Change Mode
  <sue-divider type="vertical" />
  <sue-switch :checked="collapsed" @change="changeCollapsed" />
  Inline Collapsed
  <sue-divider type="vertical" />
  <sue-switch :checked="expandAllChecked" :disabled="collapsed" @change="changeExpanded" />
  Expand All
  <sue-divider type="vertical" />
  <sue-switch :checked="theme === 'dark'" @change="changeTheme" />
  Change Style
  <br>
  <br>
  <div style="width: 256px">
    <sue-menu
      v-model:selected-keys="selectedKeys"
      v-model:open-keys="openKeys"
      :inline-collapsed="inlineCollapsed"
      :mode="mode"
      :theme="theme"
    >
      <sue-menu-item key="1">
        <template #icon>
          <Mail />
        </template>
        Navigation One
      </sue-menu-item>

      <sue-menu-item key="2">
        <template #icon>
          <Calendar />
        </template>
        Navigation Two
      </sue-menu-item>

      <sue-sub-menu key="sub1">
        <template #icon>
          <LayoutGrid />
        </template>
        <template #title>
          Navigation Two
        </template>

        <sue-menu-item key="3">
          Option 3
        </sue-menu-item>
        <sue-menu-item key="4">
          Option 4
        </sue-menu-item>

        <sue-sub-menu key="sub1-2">
          <template #title>
            Submenu
          </template>

          <sue-menu-item key="5">
            Option 5
          </sue-menu-item>
          <sue-menu-item key="6">
            Option 6
          </sue-menu-item>
        </sue-sub-menu>
      </sue-sub-menu>

      <sue-sub-menu key="sub2">
        <template #icon>
          <Settings />
        </template>
        <template #title>
          Navigation Three
        </template>

        <sue-menu-item key="7">
          Option 7
        </sue-menu-item>
        <sue-menu-item key="8">
          Option 8
        </sue-menu-item>
        <sue-menu-item key="9">
          Option 9
        </sue-menu-item>
        <sue-menu-item key="10">
          Option 10
        </sue-menu-item>
      </sue-sub-menu>

      <sue-menu-item key="link">
        <template #icon>
          <Link />
        </template>
        <a
          href="https://@sue/design-web-vue.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Antdv Next
        </a>
      </sue-menu-item>
    </sue-menu>
  </div>
</template>
```
