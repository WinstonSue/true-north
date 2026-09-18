# Big Data

## Description (en-US)

Select use [virtual scroll] which get better performance, turn off it by setting `:virtual="false"`.

## Source

```vue
<script setup lang="ts">
import type { SelectProps } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const options: SelectProps['options'] = []
for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`
  options.push({
    label: value,
    value,
    disabled: i === 10,
  })
}
const value = shallowRef(['a10', 'c12'])
</script>

<template>
  <sue-editable-text :level="4">
    {{ options?.length }} Items
  </sue-editable-text>
  <sue-select v-model:value="value" mode="multiple" style="width: 100%" placeholder="Please select" :options="options" />
</template>

<style scoped>

</style>
```
