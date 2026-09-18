# Lazy

## Description (en-US)

Lazy rendering mode, only updates panel size when mouse moves. Suitable for large pages to avoid frequent re-rendering causing lag.

## Source

```vue
<template>
  <sue-space vertical style="width: 100%">
    <sue-splitter lazy style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
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
    <sue-splitter
      lazy
      orientation="vertical"
      style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    >
      <sue-splitter-panel default-size="40%" min="30%" max="70%">
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
  </sue-space>
</template>
```
