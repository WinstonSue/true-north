# Multiple

## Description (en-US)

Multiple panels split.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <sue-splitter-panel collapsible>
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Panel 1
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
    <sue-splitter-panel :collapsible="{ start: true }">
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Panel 2
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
    <sue-splitter-panel>
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Panel 3
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
  </sue-splitter>
</template>
```
