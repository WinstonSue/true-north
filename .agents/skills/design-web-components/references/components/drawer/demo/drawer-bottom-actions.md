# Drawer bottom actions

## Description (en-US)

Use Flex `full -> fill + fixed` inside Drawer body when the design shows a bottom action area and scrollable main content.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)

function showDrawer() {
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <sue-button type="primary" @click="showDrawer">
    Open
  </sue-button>
  <sue-drawer
    v-model:open="open"
    title="Drawer with bottom actions"
    :size="480"
    @close="onClose"
  >
    <sue-flex vertical container="full">
      <sue-flex
        container="fill"
        style="overflow: auto; padding: 24px;"
      >
        <p v-for="index in 20" :key="index">
          Scrollable content line {{ index }}
        </p>
      </sue-flex>
      <sue-flex
        container="fixed"
        justify="flex-end"
        style="padding: 8px 24px; border-top: 1px solid var(--sue-color-split);"
      >
        <sue-space>
          <sue-button @click="onClose">
            Cancel
          </sue-button>
          <sue-button type="primary" @click="onClose">
            Submit
          </sue-button>
        </sue-space>
      </sue-flex>
    </sue-flex>
  </sue-drawer>
</template>
```
