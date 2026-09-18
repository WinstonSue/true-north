# Icon

## Description (en-US)

You can add an icon using the `icon`/`slot` property.

## Source

```vue
<script setup lang="ts">
import { Search } from '@lucide/vue'
</script>

<template>
  <sue-flex gap="small" vertical>
    <sue-flex wrap gap="small">
      <sue-button type="primary" shape="circle">
        <template #icon>
          <Search />
        </template>
      </sue-button>
      <sue-button type="primary" shape="circle">
        A
      </sue-button>
      <sue-button type="primary">
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
      <sue-button shape="circle">
        <template #icon>
          <Search />
        </template>
      </sue-button>
      <sue-button>
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
    </sue-flex>
    <sue-flex wrap gap="small">
      <sue-button shape="circle">
        <template #icon>
          <Search />
        </template>
      </sue-button>
      <sue-button>
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
      <sue-button type="dashed" shape="circle">
        <template #icon>
          <Search />
        </template>
      </sue-button>
      <sue-button type="dashed">
        <template #icon>
          <Search />
        </template>
        Search
      </sue-button>
      <sue-button href="https://www.google.com" target="_blank">
        <template #icon>
          <Search />
        </template>
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
