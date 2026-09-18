# Collapsible Icon

## Description (en-US)

Control the display of collapsible icon with `showCollapsibleIcon`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showIconMode = ref<'auto' | boolean>(true)

const options = [
  { label: 'Auto', value: 'auto' },
  { label: 'True', value: true },
  { label: 'False', value: false },
]
</script>

<template>
  <sue-flex vertical :gap="20">
    <sue-flex :gap="5">
      <p>ShowCollapsibleIcon:</p>
      <sue-radio-group v-model:value="showIconMode" :options="options" />
    </sue-flex>
    <sue-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <sue-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
        min="20%"
      >
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            First
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
      <sue-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
      >
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            Second
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
      <sue-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
      >
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            Third
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
    </sue-splitter>
  </sue-flex>
</template>
```
