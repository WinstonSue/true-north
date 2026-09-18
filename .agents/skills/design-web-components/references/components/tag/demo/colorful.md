# Colorful Tag

## Description (en-US)

We preset a series of colorful tag styles for use in different situations. You can also set it to a hex color string for custom color.

## Source

```vue
<script setup lang="ts">
const variants = ['filled', 'solid', 'outlined'] as const
const presets = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]
const customs = ['#f50', '#2db7f5', '#87d068', '#108ee9']
</script>

<template>
  <div v-for="variant in variants" :key="variant">
    <sue-divider title-placement="start">
      Presets {{ variant }}
    </sue-divider>
    <sue-flex gap="small" align="center" wrap>
      <template v-for="color in presets" :key="color">
        <sue-tag :variant="variant" :color="color">
          {{ color }}
        </sue-tag>
      </template>
    </sue-flex>
  </div>
  <div v-for="variant in variants" :key="variant">
    <sue-divider title-placement="start">
      Custom {{ variant }}
    </sue-divider>
    <sue-flex gap="small" align="center" wrap>
      <template v-for="color in customs" :key="color">
        <sue-tag :variant="variant" :color="color">
          {{ color }}
        </sue-tag>
      </template>
    </sue-flex>
  </div>
</template>
```
