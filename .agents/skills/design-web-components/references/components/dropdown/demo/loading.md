# Loading

## Description (en-US)

A loading indicator can be added to a button by setting the `loading` property.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { ChevronDown, Ellipsis } from '@lucide/vue'
import { ref } from 'vue'

const items: MenuItemType[] = [
  {
    label: 'Submit and continue',
    key: '1',
  },
]

const loadings = ref<boolean[]>([])

function enterLoading(index: number) {
  const nextLoadings = [...loadings.value]
  nextLoadings[index] = true
  loadings.value = nextLoadings
  setTimeout(() => {
    const resetLoadings = [...loadings.value]
    resetLoadings[index] = false
    loadings.value = resetLoadings
  }, 6000)
}
</script>

<template>
  <sue-space direction="vertical">
    <sue-space-compact>
      <sue-button type="primary" loading>
        Submit
      </sue-button>
      <sue-dropdown :menu="{ items }">
        <sue-button type="primary">
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>
    <sue-space-compact size="small">
      <sue-button type="primary" loading>
        Submit
      </sue-button>
      <sue-dropdown :menu="{ items }">
        <sue-button type="primary">
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>
    <sue-space-compact>
      <sue-button type="primary" :loading="loadings[0]" @click="enterLoading(0)">
        Submit
      </sue-button>
      <sue-dropdown :menu="{ items }">
        <sue-button type="primary">
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>
    <sue-space-compact>
      <sue-button :loading="loadings[1]" @click="enterLoading(1)">
        Submit
      </sue-button>
      <sue-dropdown :menu="{ items }">
        <sue-button>
          <template #icon>
            <ChevronDown />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>
  </sue-space>
</template>
```
