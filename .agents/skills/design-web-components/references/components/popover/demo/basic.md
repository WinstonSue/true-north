# Basic

## Description (en-US)

The most basic example. The size of the floating layer depends on the contents region.

## Source

```vue
<template>
  <sue-popover title="Title">
    <template #content>
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    </template>
    <sue-button type="primary">
      Hover me
    </sue-button>
  </sue-popover>
</template>

<style scoped>
:global(.sue-popover-content p) {
  margin: 0;
}
</style>
```
