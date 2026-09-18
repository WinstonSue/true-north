# Typesetting

## Description (en-US)

Basic layout.

Child elements are aligned in the parent by `start`, `center`, `end`, `space-between`, `space-around`, and `space-evenly`.

## Source

```vue
<template>
  <sue-divider title-placement="left">
    sub-element align left
  </sue-divider>
  <sue-row justify="start">
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    sub-element align center
  </sue-divider>
  <sue-row justify="center">
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    sub-element align right
  </sue-divider>
  <sue-row justify="end">
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    sub-element monospaced arrangement
  </sue-divider>
  <sue-row justify="space-between">
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    sub-element align full
  </sue-divider>
  <sue-row justify="space-around">
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    sub-element align evenly
  </sue-divider>
  <sue-row justify="space-evenly">
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
    <sue-col :span="4">
      col-4
    </sue-col>
  </sue-row>
</template>
```
