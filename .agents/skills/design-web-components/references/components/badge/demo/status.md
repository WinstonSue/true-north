# Status

## Description (en-US)

Standalone badge with status.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-space>
    <sue-badge status="success" />
    <sue-badge status="error" />
    <sue-badge status="default" />
    <sue-badge status="processing" />
    <sue-badge status="warning" />
  </sue-space>
  <br>
  <sue-space vertical>
    <sue-badge status="success" text="Success" />
    <sue-badge status="error" text="Error" />
    <sue-badge status="default" text="Default" />
    <sue-badge status="processing" text="Processing" />
    <sue-badge status="warning" text="Warning" />
  </sue-space>
</template>
```
