# Round shape

## Description (en-US)

Round shape of Segmented.

## Source

```vue
<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { shallowRef } from 'vue'

const size = shallowRef<any>('medium')
const iconObj: Record<string, any> = {
  light: Sun,
  dark: Moon,
}
</script>

<template>
  <sue-flex gap="small" align="flex-start" vertical>
    <sue-segmented v-model:value="size" :options="['small', 'medium', 'large']" />
    <sue-segmented :options="[{ value: 'light' }, { value: 'dark' }]" :size="size" shape="round">
      <template #iconRender="{ value }">
        <component :is="iconObj[value]" v-if="iconObj[value]" />
      </template>
    </sue-segmented>
  </sue-flex>
</template>
```
