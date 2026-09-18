# Space Size

## Description (en-US)

Customize space size.

## Source

```vue
<script setup lang="ts">
import type { SizeType } from '@sue/design-web-vue'
import { ref } from 'vue'

const size = ref<SizeType | 'customize'>('small')
const customizeSize = ref(0)
</script>

<template>
  <sue-radio-group v-model:value="size">
    <sue-radio value="small">
      Small
    </sue-radio>
    <sue-radio value="medium">
      Middle
    </sue-radio>
    <sue-radio value="large">
      Large
    </sue-radio>
    <sue-radio value="customize">
      Customize
    </sue-radio>
  </sue-radio-group>

  <br>
  <br>

  <template v-if="size === 'customize'">
    <sue-slider v-model:value="customizeSize" />
    <br>
  </template>

  <sue-space :size="size === 'customize' ? customizeSize : size">
    <sue-button type="primary">
      Primary
    </sue-button>
    <sue-button>Default</sue-button>
    <sue-button type="dashed">
      Dashed
    </sue-button>
    <sue-button type="link">
      Link
    </sue-button>
  </sue-space>
</template>
```
