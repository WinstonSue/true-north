# Progress bar

## Description (en-US)

A standard progress bar.

## Source

```vue
<template>
  <sue-flex gap="small" vertical>
    <sue-progress :percent="30" />
    <sue-progress :percent="50" status="active" />
    <sue-progress :percent="70" status="exception" />
    <sue-progress :percent="100" />
    <sue-progress :percent="50" :show-info="false" />
  </sue-flex>
</template>
```
