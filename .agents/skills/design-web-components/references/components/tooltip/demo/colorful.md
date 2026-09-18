# Colorful Tooltip

## Description (en-US)

We preset a series of colorful Tooltip styles for use in different situations.

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
const customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9']
</script>

<template>
  <sue-divider title-placement="start">
    Presets
  </sue-divider>
  <sue-space wrap>
    <template v-for="color in colors" :key="color">
      <sue-tooltip :color="color" title="prompt text">
        <sue-button>{{ color }}</sue-button>
      </sue-tooltip>
    </template>
  </sue-space>
  <sue-divider title-placement="start">
    Custom
  </sue-divider>
  <sue-space wrap>
    <template v-for="color in customColors" :key="color">
      <sue-tooltip :color="color" title="prompt text">
        <sue-button>{{ color }}</sue-button>
      </sue-tooltip>
    </template>
  </sue-space>
</template>
```
