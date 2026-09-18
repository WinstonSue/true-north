# Vertical

## Description (en-US)

Vertical split panel.

## Source

```vue
<template>
  <sue-splitter orientation="vertical" style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <sue-splitter-panel>
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          First
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
    <sue-splitter-panel>
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Second
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
  </sue-splitter>
</template>
```
