# 12 hours

## Description (en-US)

TimePicker of 12 hours format, with default format `h:mm:ss a`.

## Source

```vue
<script setup lang="ts">
function onChange(time: any, timeString: string) {
  console.log(time, timeString)
}
</script>

<template>
  <sue-space wrap>
    <sue-time-picker use12-hours @change="onChange" />
    <sue-time-picker use12-hours format="h:mm:ss A" @change="onChange" />
    <sue-time-picker use12-hours format="h:mm a" @change="onChange" />
  </sue-space>
</template>
```
