# Three Sizes

## Description (en-US)

The input box comes in three sizes: large, medium and small. Large is used in the form, while the medium size is the default.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'

const defaultValue = dayjs('12:08:23', 'HH:mm:ss')
</script>

<template>
  <sue-space wrap>
    <sue-time-picker :default-value="defaultValue" size="large" />
    <sue-time-picker :default-value="defaultValue" />
    <sue-time-picker :default-value="defaultValue" size="small" />
  </sue-space>
</template>
```
