# SFC Mode

## Description (en-US)

Support SFC mode with `sue-collapse-panel`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeKeys = ref(['1'])
</script>

<template>
  <sue-collapse v-model:active-key="activeKeys">
    <sue-collapse-panel key="1" header="This is panel header 1">
      <p>
        A dog is a type of domesticated animal. Known for its loyalty and faithfulness.
      </p>
    </sue-collapse-panel>
    <sue-collapse-panel key="2">
      <template #header>
        <span>This is panel header 2</span>
      </template>
      <template #extra>
        <sue-tag color="blue">
          Extra
        </sue-tag>
      </template>
      <p>
        It can be found as a welcome guest in many households across the world.
      </p>
    </sue-collapse-panel>
  </sue-collapse>
</template>
```
