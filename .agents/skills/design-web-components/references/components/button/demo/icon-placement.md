# Icon Placement

## Description (en-US)

You can set the position of a button's icon by setting the `iconPlacement` to `start` or `end` respectively.

## Source

```vue
<script setup lang="ts">
import { Search } from '@lucide/vue'
import { ref } from 'vue'

const position = ref<'start' | 'end'>('end')
</script>

<template>
  <sue-space>
    <sue-radio-group v-model:value="position">
      <sue-radio-button value="start">
        start
      </sue-radio-button>
      <sue-radio-button value="end">
        end
      </sue-radio-button>
    </sue-radio-group>
  </sue-space>
  <sue-divider title-placement="start" plain>
    Preview
  </sue-divider>
  <sue-flex gap="small" vertical>
    <sue-flex wrap gap="small">
      <sue-tooltip title="search">
        <sue-button type="primary" shape="circle">
          <template #icon>
            <Search />
          </template>
        </sue-button>
      </sue-tooltip>
      <sue-button type="primary" shape="circle">
        A
      </sue-button>
      <sue-button type="primary" :icon-placement="position">
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
      <sue-tooltip title="search">
        <sue-button shape="circle">
          <template #icon>
            <Search />
          </template>
        </sue-button>
      </sue-tooltip>
      <sue-button :icon-placement="position">
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
    </sue-flex>
    <sue-flex wrap gap="small">
      <sue-tooltip title="search">
        <sue-button shape="circle">
          <template #icon>
            <Search />
          </template>
        </sue-button>
      </sue-tooltip>
      <sue-button type="text" :icon-placement="position">
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
      <sue-tooltip title="search">
        <sue-button type="dashed" shape="circle">
          <template #icon>
            <Search />
          </template>
        </sue-button>
      </sue-tooltip>
      <sue-button type="dashed" :icon-placement="position">
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
      <sue-button
        href="https://www.google.com"
        target="_blank"
        :icon-placement="position"
      >
        <template #icon>
          <Search />
        </template>
      </sue-button>
      <sue-button type="primary" loading :icon-placement="position">
        Loading
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
