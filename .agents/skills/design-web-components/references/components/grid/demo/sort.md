# Grid sort

## Description (en-US)

By using `push` and `pull`, you can easily change column order.

## Source

```vue
<template>
  <sue-row>
    <sue-col :span="18" :push="6">
      col-18 col-push-6
    </sue-col>
    <sue-col :span="6" :pull="18">
      col-6 col-pull-18
    </sue-col>
  </sue-row>
</template>
```
