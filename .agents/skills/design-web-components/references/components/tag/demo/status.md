# Status Tag

## Description (en-US)

We preset five different colors, you can set color property such as `success`,`processing`,`error`,`default` and `warning` to indicate specific status.

## Source

```vue
<script setup lang="ts">
import { CircleCheck, Clock, CircleX, CircleAlert, RefreshCw } from '@lucide/vue'

const variants = ['filled', 'solid', 'outlined'] as const
const presets = [
  { status: 'success', icon: CircleCheck },
  { status: 'processing', icon: RefreshCw },
  { status: 'warning', icon: CircleAlert },
  { status: 'error', icon: CircleX },
  { status: 'default', icon: Clock },
]
</script>

<template>
  <div v-for="variant in variants" :key="variant">
    <sue-divider title-placement="start">
      {{ variant }}
    </sue-divider>
    <sue-flex gap="small" wrap align="center">
      <template v-for="preset in presets" :key="preset.status">
        <sue-tag :variant="variant" :color="preset.status">
          <template #icon>
            <component :is="preset.icon" :spin="preset.icon === RefreshCw" />
          </template>
          {{ preset.status }}
        </sue-tag>
      </template>
    </sue-flex>
  </div>
</template>
```
