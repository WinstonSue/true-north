# Layout Group

## Description (en-US)

Nested Splitter for complex layout.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-splitter style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <sue-splitter-panel collapsible>
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Left
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
    <sue-splitter-panel>
      <sue-splitter orientation="vertical">
        <sue-splitter-panel>
          <sue-flex justify="center" align="center" style="height: 100%">
            <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
              Top
            </sue-editable-text>
          </sue-flex>
        </sue-splitter-panel>
        <sue-splitter-panel>
          <sue-flex justify="center" align="center" style="height: 100%">
            <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
              Bottom
            </sue-editable-text>
          </sue-flex>
        </sue-splitter-panel>
      </sue-splitter>
    </sue-splitter-panel>
  </sue-splitter>
</template>
```
