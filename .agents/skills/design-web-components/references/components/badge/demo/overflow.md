# Overflow Count

## Description (en-US)

`${overflowCount}+` is displayed when count is larger than `overflowCount`. The default value of `overflowCount` is `99`.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-space size="large">
    <sue-badge :count="99">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
    <sue-badge :count="100">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
    <sue-badge :count="99" :overflow-count="10">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
    <sue-badge :count="1000" :overflow-count="999">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
  </sue-space>
</template>
```
