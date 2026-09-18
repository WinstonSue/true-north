# Extra content

## Description (en-US)

You can add extra actions to the right or left or even both side of Tabs.

## Source

```vue
<script setup lang="ts">
import type { TabsProps } from '@sue/design-web-vue'
import { computed, h, ref, resolveComponent } from 'vue'

type PositionType = 'left' | 'right'

const options = ['left', 'right']

const items: TabsProps['items'] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Content of tab ${id}`,
  }
})

const position = ref<PositionType[]>(['left', 'right'])

const slot = computed(() => {
  if (position.value.length === 0) {
    return null
  }
  const result: Record<string, boolean> = {}
  position.value.forEach((dir) => {
    result[dir] = true
  })
  return result
})

const extraContent = computed(() =>
  h(resolveComponent('sue-button') as any, null, { default: () => 'Extra Action' }),
)
</script>

<template>
  <div>
    <sue-tabs :items="items" :tab-bar-extra-content="extraContent" />
    <br>
    <br>
    <br>
    <div>You can also specify its direction or both side</div>
    <sue-divider />
    <sue-checkbox-group v-model:value="position" :options="options" />
    <br>
    <br>
    <sue-tabs :items="items">
      <template v-if="slot?.left" #leftExtra>
        <sue-button class="tabs-extra-demo-button">
          Left Extra Action
        </sue-button>
      </template>
      <template v-if="slot?.right" #rightExtra>
        <sue-button>Right Extra Action</sue-button>
      </template>
    </sue-tabs>
  </div>
</template>

<style scoped>
.tabs-extra-demo-button {
  margin-inline-end: 16px;
}

.sue-row-rtl .tabs-extra-demo-button {
  margin-inline-end: 0;
  margin-inline-start: 16px;
}
</style>
```
