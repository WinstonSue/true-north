# Variants

## Description (en-US)

Variants of TreeSelect, there are four variants: `outlined` `filled` `borderless` and `underlined`.

## Source

```vue
<script setup lang="ts">
const style = {
  width: '100%',
  maxWidth: '100%',
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-tree-select :style="style" placeholder="Please select" variant="borderless" />
    <sue-tree-select :style="style" placeholder="Please select" variant="filled" />
    <sue-tree-select :style="style" placeholder="Please select" variant="outlined" />
    <sue-tree-select :style="style" placeholder="Please select" variant="underlined" />
  </sue-flex>
</template>
```
