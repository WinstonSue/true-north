# Radio Group

## Description (en-US)

A group of radio components.

## Source

```vue
<script setup lang="ts">
import type { RadioOptionType } from '@sue/design-web-vue'
import { ChartColumn, ChartScatter, ChartLine, ChartPie } from '@lucide/vue'
import { shallowRef } from 'vue'

const iconsMap: any = {
  1: ChartLine,
  2: ChartScatter,
  3: ChartColumn,
  4: ChartPie,
}
const options: RadioOptionType[] = [
  {
    value: 1,
    class: 'option-1',
    label: 'LineChat',
  },
  {
    value: 2,
    class: 'option-2',
    label: 'DotChart',
  },
  {
    value: 3,
    class: 'option-3',
    label: 'BarChart',
  },
  {
    value: 4,
    class: 'option-4',
    label: 'PieChart',
  },
]
const val = shallowRef(1)
</script>

<template>
  <sue-radio-group v-model:value="val" :options="options">
    <template #labelRender="{ item }">
      <sue-flex gap="small" justify="center" align="center" vertical>
        <component :is="iconsMap[item.value]" style="font-size: 18px;" />
        {{ item.label }}
      </sue-flex>
    </template>
  </sue-radio-group>
</template>
```
