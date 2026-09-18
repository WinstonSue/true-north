# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { ProgressProps } from '@sue/design-web-vue'

const classes: ProgressProps['classes'] = {
  root: 'demo-progress-root',
  rail: 'demo-progress-rail',
  track: 'demo-progress-track',
}

const stylesFn: ProgressProps['styles'] = (info) => {
  const percent = info?.props?.percent ?? 0
  const hue = 200 - (200 * percent) / 100
  return {
    track: {
      backgroundImage: `
        linear-gradient(
          to right,
          hsla(${hue}, 85%, 65%, 1),
          hsla(${hue + 30}, 90%, 55%, 0.95)
        )`,
      borderRadius: 8,
      transition: 'all 0.3s ease',
    },
    rail: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 8,
    },
  } as ProgressProps['styles']
}
</script>

<template>
  <sue-flex vertical gap="large">
    <sue-progress :classes="classes" :styles="stylesFn" :percent="10" />
    <sue-progress :classes="classes" :styles="stylesFn" :percent="20" />
    <sue-progress :classes="classes" :styles="stylesFn" :percent="40" />
    <sue-progress :classes="classes" :styles="stylesFn" :percent="60" />
    <sue-progress :classes="classes" :styles="stylesFn" :percent="80" />
    <sue-progress :classes="classes" :styles="stylesFn" :percent="99" />
  </sue-flex>
</template>

<style>
.demo-progress-root {
  width: 100%;
}

.demo-progress-rail {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.demo-progress-track {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
</style>
```
