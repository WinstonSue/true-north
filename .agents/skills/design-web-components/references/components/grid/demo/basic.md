# Basic Grid

## Description (en-US)

From the stack to the horizontal arrangement.

Create a basic grid using a single set of `Row` and `Col`. All `Col` must be placed inside a `Row`.

## Source

```vue
<template>
  <sue-row>
    <sue-col :span="24">
      col
    </sue-col>
  </sue-row>

  <sue-row>
    <sue-col :span="12">
      col-12
    </sue-col>
    <sue-col :span="12">
      col-12
    </sue-col>
  </sue-row>
  <sue-row>
    <sue-col :span="8">
      col-8
    </sue-col>
    <sue-col :span="8">
      col-8
    </sue-col>
    <sue-col :span="8">
      col-8
    </sue-col>
  </sue-row>
  <sue-row>
    <sue-col :span="6">
      col-6
    </sue-col>
    <sue-col :span="6">
      col-6
    </sue-col>
    <sue-col :span="6">
      col-6
    </sue-col>
    <sue-col :span="6">
      col-6
    </sue-col>
  </sue-row>
</template>
```
