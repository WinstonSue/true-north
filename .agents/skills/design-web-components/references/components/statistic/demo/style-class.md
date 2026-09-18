# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { StatisticProps } from '@sue/design-web-vue'
import { ArrowDown, ArrowUp } from '@lucide/vue'

const classes = {
  root: 'custom-statistic-root',
}
const styleFn: StatisticProps['styles'] = ({ props }) => {
  const numValue = Number(props.value ?? 0)
  const isNegative = Number.isFinite(numValue) && numValue < 0
  if (isNegative) {
    return {
      title: {
        color: '#ff4d4f',
      },
      content: {
        color: '#ff7875',
      },
    } satisfies StatisticProps['styles']
  }
  return {}
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-statistic
      :value="93241"
      title="Monthly Active Users"
      :classes="classes"
      :styles="{ title: { color: '#1890ff', fontWeight: '600px' }, content: { fontSize: '24px' } }"
      suffix="users"
    >
      <template #prefix>
        <ArrowUp />
      </template>
    </sue-statistic>

    <sue-statistic
      :value="-18.7"
      title="Yearly Loss"
      :precision="1"
      :classes="classes"
      :styles="styleFn"
      suffix="%"
    >
      <template #prefix>
        <ArrowDown />
      </template>
    </sue-statistic>
  </sue-flex>
</template>

<style scoped>
.custom-statistic-root {
  border: 2px dashed #ccc;
  padding: 16px;
  border-radius: 8px;
}
</style>
```
