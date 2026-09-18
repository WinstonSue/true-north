# Title Offset

## Description (en-US)

Use `titleSpan` to set the title span space.

## Source

```vue
<script lang="ts" setup>
const items = [
  { title: '05:10', content: 'Create a services' },
  { title: '09:03', content: 'Solve initial network problems' },
  { content: 'Technical testing' },
  { title: '11:28', content: 'Network problems being solved' },
]
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-editable-text :level="5" :style="{ margin: 0 }">
      titleSpan = 100px
    </sue-editable-text>
    <sue-timeline :items="items" title-span="100px" />
    <sue-editable-text :level="5" :style="{ margin: 0 }">
      titleSpan = 25%
    </sue-editable-text>
    <sue-timeline :items="items" title-span="25%" />
    <sue-editable-text :level="5" :style="{ margin: 0 }">
      titleSpan = 18, mode = end
    </sue-editable-text>
    <sue-timeline :items="items" :title-span="18" mode="end" />
  </sue-flex>
</template>
```
