# Status

## Description (en-US)

Add status to TimePicker with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-space vertical>
    <sue-time-picker status="error" />
    <sue-time-picker status="warning" />
    <sue-time-range-picker status="error" />
    <sue-time-range-picker status="warning" />
  </sue-space>
</template>
```
