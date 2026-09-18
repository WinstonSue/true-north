# Column offset

## Description (en-US)

`offset` can set the column to the right side. For example, `offset={4}` shifts the element to the right by four columns.

## Source

```vue
<template>
  <sue-row>
    <sue-col :span="8">
      col-8
    </sue-col>
    <sue-col :span="8" :offset="8">
      col-8
    </sue-col>
  </sue-row>
  <sue-row>
    <sue-col :span="6" :offset="6">
      col-6 col-offset-6
    </sue-col>
    <sue-col :span="6" :offset="6">
      col-6 col-offset-6
    </sue-col>
  </sue-row>
  <sue-row>
    <sue-col :span="12" :offset="6">
      col-12 col-offset-6
    </sue-col>
  </sue-row>
</template>
```
