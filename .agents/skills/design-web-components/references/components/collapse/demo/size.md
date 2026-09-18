# Size

## Description (en-US)

Antdv Next supports medium, large and small collapse sizes.

If a large or small collapse is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a collapse with the medium size.

## Source

```vue
<script setup lang="ts">
import { h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const mediumItems = [
  {
    key: '1',
    label: 'This is medium size panel header',
    content: h('p', text),
  },
]

const smallItems = [
  {
    key: '1',
    label: 'This is small size panel header',
    content: h('p', text),
  },
]

const largeItems = [
  {
    key: '1',
    label: 'This is large size panel header',
    content: h('p', text),
  },
]
</script>

<template>
  <sue-divider title-placement="start">
    Medium Size
  </sue-divider>
  <sue-collapse :items="mediumItems" />
  <sue-divider title-placement="start">
    Small Size
  </sue-divider>
  <sue-collapse size="small" :items="smallItems" />
  <sue-divider title-placement="start">
    Large Size
  </sue-divider>
  <sue-collapse size="large" :items="largeItems" />
</template>
```
