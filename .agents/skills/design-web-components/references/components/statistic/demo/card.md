# In Card

## Description (en-US)

Display statistic data in Card.

## Source

```vue
<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@lucide/vue'
</script>

<template>
  <sue-row :gutter="16">
    <sue-col :span="12">
      <sue-card variant="borderless">
        <sue-statistic title="Active" :value="11.28" :precision="2" :styles="{ content: { color: '#3f8600' } }" suffix="%">
          <template #prefix>
            <ArrowUp />
          </template>
        </sue-statistic>
      </sue-card>
    </sue-col>
    <sue-col :span="12">
      <sue-card variant="borderless">
        <sue-statistic title="Idle" :value="9.3" :precision="2" :styles="{ content: { color: '#cf1322' } }" suffix="%">
          <template #prefix>
            <ArrowDown />
          </template>
        </sue-statistic>
      </sue-card>
    </sue-col>
  </sue-row>
</template>
```
