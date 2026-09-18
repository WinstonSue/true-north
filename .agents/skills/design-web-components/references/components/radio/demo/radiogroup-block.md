# Block Radio.Group

## Description (en-US)

The `block` property will make a Radio.Group fit to its parent width.

## Source

```vue
<script setup lang="ts">
import type { CheckboxOptionType } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const options: CheckboxOptionType[] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
]
const value = shallowRef('Apple')
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-radio-group v-model:value="value" block :options="options" />
    <sue-radio-group
      v-model:value="value"
      block
      :options="options"
      option-type="button"
      button-style="solid"
    />
    <sue-radio-group
      v-model:value="value"
      block
      :options="options"
      option-type="button"
    />
  </sue-flex>
</template>
```
