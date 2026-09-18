# gap

## Description (en-US)

Set the `gap` between elements. The `small`, `middle`, and `large` presets map to the global `paddingXS`, `padding`, and `paddingLG` tokens. You can also customize the gap size.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

type SizeType = 'small' | 'medium' | 'large' | undefined

const gapSize = ref<SizeType | 'customize'>('small')

const customGapSize = ref<number>(0)
</script>

<template>
  <sue-flex gap="middle" vertical>
    <sue-radio-group v-model:value="gapSize">
      <sue-radio value="small">
        small
      </sue-radio>
      <sue-radio value="medium">
      medium
    </sue-radio>
      <sue-radio value="large">
        large
      </sue-radio>
      <sue-radio value="customize">
        customize
      </sue-radio>
    </sue-radio-group>
    <template v-if="gapSize === 'customize'">
      <sue-slider v-model:value="customGapSize" />
    </template>
    <sue-flex :gap="gapSize !== 'customize' ? gapSize : customGapSize">
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
    </sue-flex>
  </sue-flex>
</template>
```
