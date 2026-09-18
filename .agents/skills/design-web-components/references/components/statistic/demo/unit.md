# Unit

## Description (en-US)

Add unit through `prefix` and `suffix`.

## Source

```vue
<script lang="ts" setup>
import { ThumbsUp } from '@lucide/vue'
</script>

<template>
  <sue-row :gutter="16">
    <sue-col :span="12">
      <sue-statistic title="Feedback" :value="1128">
        <template #prefix>
          <ThumbsUp />
        </template>
      </sue-statistic>
    </sue-col>
    <sue-col :span="12">
      <sue-statistic title="Unmerged" :value="93" suffix="/ 100" />
    </sue-col>
  </sue-row>
</template>
```
