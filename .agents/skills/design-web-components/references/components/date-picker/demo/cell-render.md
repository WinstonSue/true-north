# Customized Cell Rendering

## Description (en-US)

We can customize the rendering of the cells in the calendar by providing a `cellRender` slot to `DatePicker`.

## Source

```vue
<script setup lang="ts">
import { theme } from '@sue/design-web-vue'

const { token } = theme.useToken()
const highlightStyle = {
  border: `1px solid ${token.value.colorPrimary}`,
  borderRadius: '50%',
}
</script>

<template>
  <sue-space vertical :size="12">
    <sue-date-picker>
      <template #cellRender="{ current, info }">
        <component :is="info.originNode" v-if="info.type !== 'date'" />
        <div v-else class="sue-picker-cell-inner" :style="current.date() === 1 ? highlightStyle : {}">
          {{ current.date() }}
        </div>
      </template>
    </sue-date-picker>
    <sue-range-picker>
      <template #cellRender="{ current, info }">
        <component :is="info.originNode" v-if="info.type !== 'date'" />
        <div v-else class="sue-picker-cell-inner" :style="current.date() === 1 ? highlightStyle : {}">
          {{ current.date() }}
        </div>
      </template>
    </sue-range-picker>
  </sue-space>
</template>
```
