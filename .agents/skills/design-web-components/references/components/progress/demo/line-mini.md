# Mini size progress bar

## Description (en-US)

Appropriate for a narrow area.

## Source

```vue
<template>
  <sue-flex vertical gap="small" style="width: 180px">
    <sue-progress :percent="30" size="small" />
    <sue-progress :percent="50" size="small" status="active" />
    <sue-progress :percent="70" size="small" status="exception" />
    <sue-progress :percent="100" size="small" />
  </sue-flex>
</template>
```
