# Circular progress bar with steps

## Description (en-US)

A circular progress bar that supports steps and color segments, default gap is 2px.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const stepsCount = ref(5)
const stepsGap = ref(7)
</script>

<template>
  <div>
    <sue-editable-text :level="5">
      Custom count:
    </sue-editable-text>
    <sue-slider v-model:value="stepsCount" :min="2" :max="10" />
    <sue-editable-text :level="5">
      Custom gap:
    </sue-editable-text>
    <sue-slider v-model:value="stepsGap" :step="4" :min="0" :max="40" />
    <sue-flex wrap gap="middle" style="margin-top: 16px">
      <sue-progress
        type="dashboard"
        :steps="8"
        :percent="50"
        rail-color="rgba(0, 0, 0, 0.06)"
        :stroke-width="20"
      />
      <sue-progress
        type="circle"
        :percent="100"
        :steps="{ count: stepsCount, gap: stepsGap }"
        rail-color="rgba(0, 0, 0, 0.06)"
        :stroke-width="20"
      />
    </sue-flex>
  </div>
</template>
```
