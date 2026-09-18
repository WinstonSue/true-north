# Custom text format

## Description (en-US)

You can set a custom text by setting the `format` prop.

## Source

```vue
<template>
  <sue-flex gap="small" wrap>
    <sue-progress type="circle" :percent="75" :format="percent => `${percent} Days`" />
    <sue-progress type="circle" :percent="100" :format="() => 'Done'" />
  </sue-flex>
</template>
```
