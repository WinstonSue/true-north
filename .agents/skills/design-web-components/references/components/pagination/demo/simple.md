# Simple mode

## Description (en-US)

Simple mode.

## Source

```vue
<template>
  <sue-space direction="vertical" size="medium" style="width: 100%">
    <sue-pagination simple :default-current="2" :total="50" />
    <sue-pagination :simple="{ readOnly: true }" :default-current="2" :total="50" />
    <sue-pagination simple :default-current="2" :total="50" disabled />
  </sue-space>
</template>
```
