# Colorful Badge

## Description (en-US)

We preset a series of colorful Badge styles for use in different situations. You can also set it to a hex color string for custom color.

## Source

```vue
<script setup lang="ts">
const colors = [
  'magenta',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
]
</script>

<template>
  <sue-divider orientation="left">
    Presets
  </sue-divider>
  <sue-space vertical>
    <sue-badge v-for="color in colors" :key="color" :color="color" :text="color" />
  </sue-space>
  <sue-divider orientation="left">
    Custom
  </sue-divider>
  <sue-space vertical>
    <sue-badge color="#f50" text="#f50" />
    <sue-badge color="rgb(45, 183, 245)" text="rgb(45, 183, 245)" />
    <sue-badge color="hsl(102, 53%, 61%)" text="hsl(102, 53%, 61%)" />
    <sue-badge color="hwb(205 6% 9%)" text="hwb(205 6% 9%)" />
  </sue-space>
</template>
```
