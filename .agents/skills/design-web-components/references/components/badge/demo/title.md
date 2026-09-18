# Title

## Description (en-US)

The badge will display `title` when hovered over, instead of `count`.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-space size="large">
    <sue-badge :count="5" title="Custom hover text">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
    <sue-badge :count="-5" title="Negative">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
  </sue-space>
</template>
```
