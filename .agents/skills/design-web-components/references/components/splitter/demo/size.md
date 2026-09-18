# Basic

## Description (en-US)

Set the default size with `defaultSize`, and restrict the panel size with `min` and `max`.

## Source

```vue
<template>
  <sue-splitter style="height: 200px;box-shadow: 0 0 10px rgba(0,0,0,0.1)">
    <sue-splitter-panel default-size="40%" min="20%" max="70%">
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
