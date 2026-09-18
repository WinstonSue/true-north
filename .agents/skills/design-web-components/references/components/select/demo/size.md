# Sizes

## Description (en-US)

The Select input has three sizes: large (40px), medium (32px), and small (24px).

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type SizeType = 'large' | 'medium' | 'small'

const options = Array.from({ length: 26 }, (_, i) => {
  const value = (i + 10).toString(36) + (i + 10)
  return { value, label: value }
})

const size = shallowRef<SizeType>('medium')
const value1 = shallowRef('a10')
const value2 = shallowRef(['a10', 'c12'])
const value3 = shallowRef(['a10', 'c12'])

function handleChange(val: string | string[]) {
  console.log(`Selected: ${val}`)
}
</script>

<template>
  <sue-radio-group v-model:value="size">
    <sue-radio-button value="large">
      Large
    </sue-radio-button>
    <sue-radio-button value="medium">
      Medium
    </sue-radio-button>
    <sue-radio-button value="small">
      Small
    </sue-radio-button>
  </sue-radio-group>
  <br>
  <br>
  <sue-space vertical style="width: 100%">
    <sue-select
      v-model:value="value1"
      :size="size"
      style="width: 200px"
      :options="options"
      @change="handleChange"
    />
    <sue-select
      v-model:value="value2"
      mode="multiple"
      :size="size"
      placeholder="Please select"
      style="width: 100%"
      :options="options"
      @change="handleChange"
    />
    <sue-select
      v-model:value="value3"
      mode="tags"
      :size="size"
      placeholder="Please select"
      style="width: 100%"
      :options="options"
      @change="handleChange"
    />
  </sue-space>
</template>
```
