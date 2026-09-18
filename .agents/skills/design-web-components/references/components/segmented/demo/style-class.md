# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { SegmentedProps } from '@sue/design-web-vue'
import { Cloud, Rocket, Zap } from '@lucide/vue'
import { h } from 'vue'

const classes: SegmentedProps['classes'] = {
  root: 'custom-segmented-root',
}
const styleFn: SegmentedProps['styles'] = (info) => {
  if (info.props.vertical) {
    return {
      root: {
        border: '1px solid #77BEF0',
        padding: '4px',
        width: '100px',
      },
      icon: {
        color: '#77BEF0',
      },
      item: {
        textAlign: 'start',
      },
    } satisfies SegmentedProps['styles']
  }
  return {}
}

const styles: SegmentedProps['styles'] = {
  root: {
    padding: '4px',
    width: '260px',
  },
}

const options: SegmentedProps['options'] = [
  {
    label: 'Boost',
    value: 'boost',
    icon: h(Rocket),
  },
  {
    label: 'Stream',
    value: 'stream',
    icon: h(Zap),
  },
  {
    label: 'Cloud',
    value: 'cloud',
    icon: h(Cloud),
  },
]
const segmentedSharedProps: SegmentedProps = {
  options,
  classes,
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-segmented v-bind="segmentedSharedProps" :styles="styles" />
    <sue-segmented v-bind="segmentedSharedProps" :styles="styleFn" vertical />
  </sue-flex>
</template>

<style scoped>
.custom-segmented-root {
  padding: 2px;
}
</style>
```
