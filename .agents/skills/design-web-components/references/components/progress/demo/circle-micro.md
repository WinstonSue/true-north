# Responsive circular progress bar

## Description (en-US)

Responsive circular progress bar. When `size` is smaller than 20, progress information will be displayed in Tooltip.

## Source

```vue
<template>
  <sue-flex align="center" gap="small">
    <sue-progress
      type="circle"
      rail-color="#e6f4ff"
      :percent="60"
      :stroke-width="20"
      :size="14"
      :format="number => `进行中，已完成${number}%`"
    />
    <span>代码发布</span>
  </sue-flex>
</template>
```
