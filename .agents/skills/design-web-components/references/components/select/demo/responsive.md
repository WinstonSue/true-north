# Responsive maxTagCount

## Description (en-US)

Auto collapse to tag with responsive case. Not recommend use in large form case since responsive calculation has a perf cost.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const options = Array.from({ length: 26 }, (_, i) => {
  const value = (i + 10).toString(36) + (i + 10)
  return { label: `Long Label: ${value}`, value }
})

const value = shallowRef(['a10', 'c12', 'h17', 'j19', 'k20'])
const value1 = shallowRef(['a10', 'c12', 'h17', 'j19'])
</script>

<template>
  <sue-space vertical style="width: 100%">
    <sue-select
      v-model:value="value"
      mode="multiple"
      style="width: 100%"
      :options="options"
      placeholder="Select Item..."
      max-tag-count="responsive"
    />
    <sue-select
      mode="multiple"
      style="width: 100%"
      disabled
      :options="options"
      placeholder="Select Item..."
      max-tag-count="responsive"
    />
    <sue-select
      v-model:value="value1"
      mode="multiple"
      style="width: 100%"
      :options="options"
      placeholder="Select Item..."
      max-tag-count="responsive"
    >
      <template #maxTagPlaceholder="omittedValues">
        <sue-tooltip>
          <template #title>
            {{ omittedValues.map((v: any) => v.label).join(', ') }}
          </template>
          <span>Hover Me</span>
        </sue-tooltip>
      </template>
    </sue-select>
  </sue-space>
</template>
```
