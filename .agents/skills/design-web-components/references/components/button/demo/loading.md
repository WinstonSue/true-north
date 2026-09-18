# Loading

## Description (en-US)

A loading indicator can be added to a button by setting the `loading` property on the `Button`. The `loading.icon` can be used to customize the loading icon.

## Source

```vue
<script setup lang="ts">
import { Power, RefreshCw } from '@lucide/vue'
import { ref } from 'vue'

const loadings = ref<boolean[]>([])
function enterLoading(index: number) {
  loadings.value[index] = true
  setTimeout(() => {
    loadings.value[index] = false
  }, 3000)
}
</script>

<template>
  <sue-flex gap="small" vertical>
    <sue-flex gap="small" align="center" wrap>
      <sue-button type="primary" loading>
        Loading
      </sue-button>
      <sue-button type="primary" size="small" loading>
        Loading
      </sue-button>
      <sue-button type="primary" loading>
        <template #icon>
          <Power />
        </template>
      </sue-button>
      <sue-button type="primary" loading>
        Loading Icon
        <template #loadingIcon>
          <RefreshCw spin />
        </template>
      </sue-button>
    </sue-flex>
    <sue-flex gap="small" wrap>
      <sue-button type="primary" :loading="loadings[0]" @click="enterLoading(0)">
        Icon Start
      </sue-button>
      <sue-button type="primary" :loading="loadings[2]" @click="enterLoading(2)">
        IconEnd
      </sue-button>
      <sue-button type="primary" :loading="loadings[1]" @click="enterLoading(1)">
        Icon Replace
        <template #icon>
          <Power />
        </template>
      </sue-button>
      <sue-button type="primary" :loading="loadings[3]" @click="enterLoading(3)">
        <template #icon>
          <Power />
        </template>
      </sue-button>
      <sue-button type="primary" :loading="loadings[3]" @click="enterLoading(3)">
        <template #icon>
          <Power />
        </template>
        <template #loadingIcon>
          <RefreshCw spin />
        </template>
        Loading Icon
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
