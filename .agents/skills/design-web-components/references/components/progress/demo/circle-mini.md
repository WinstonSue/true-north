# Mini size circular progress bar

## Description (en-US)

A smaller circular progress bar.

## Source

```vue
<template>
  <sue-flex wrap gap="small">
    <sue-progress type="circle" :percent="30" :size="80" />
    <sue-progress type="circle" :percent="70" status="exception" :size="80" />
    <sue-progress type="circle" :percent="100" :size="80" />
  </sue-flex>
</template>
```
