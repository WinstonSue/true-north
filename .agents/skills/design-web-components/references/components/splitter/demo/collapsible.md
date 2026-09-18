# Collapsible

## Description (en-US)

Collapsible panel.

## Source

```vue
<template>
  <sue-flex vertical gap="middle">
    <sue-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <sue-splitter-panel collapsible min="20%">
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            First
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
      <sue-splitter-panel collapsible>
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            Second
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
    </sue-splitter>
    <sue-splitter
      orientation="vertical"
      style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    >
      <sue-splitter-panel collapsible min="20%">
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            First
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
      <sue-splitter-panel collapsible>
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            Second
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
    </sue-splitter>
  </sue-flex>
</template>
```
