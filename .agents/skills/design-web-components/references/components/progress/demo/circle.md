# Circular progress bar

## Description (en-US)

A circular progress bar.

## Source

```vue
<template>
  <sue-flex gap="small" wrap>
    <sue-progress type="circle" :percent="75" />
    <sue-progress type="circle" :percent="70" status="exception" />
    <sue-progress type="circle" :percent="100" />
  </sue-flex>
</template>
```
