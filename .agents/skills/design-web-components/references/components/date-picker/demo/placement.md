# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import type { DatePickerProps } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

type PlacementType = DatePickerProps['placement']

const placement = shallowRef<PlacementType>('topLeft')
</script>

<template>
  <sue-space vertical :size="12">
    <sue-radio-group v-model:value="placement">
      <sue-radio-button value="topLeft">
        topLeft
      </sue-radio-button>
      <sue-radio-button value="topRight">
        topRight
      </sue-radio-button>
      <sue-radio-button value="bottomLeft">
        bottomLeft
      </sue-radio-button>
      <sue-radio-button value="bottomRight">
        bottomRight
      </sue-radio-button>
    </sue-radio-group>
    <sue-date-picker :placement="placement" />
    <sue-range-picker :placement="placement" />
  </sue-space>
</template>
```
