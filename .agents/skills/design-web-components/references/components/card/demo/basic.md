# Basic card片

## Description (en-US)

A basic card containing a title, content and an extra corner content. Supports `small`, `medium` (default), and `large` sizes.

## Source

```vue
<template>
  <sue-space vertical :size="16">
    <sue-card title="Medium (default) size card" style="width: 300px">
      <template #extra>
        <a href="#">More</a>
      </template>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </sue-card>
    <sue-card size="small" title="Small size card" style="width: 300px">
      <template #extra>
        <a href="#">More</a>
      </template>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </sue-card>
    <sue-card size="large" title="Large size card" style="width: 300px">
      <template #extra>
        <a href="#">More</a>
      </template>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </sue-card>
  </sue-space>
</template>
```
