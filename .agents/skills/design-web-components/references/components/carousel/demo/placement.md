# Position

## Description (en-US)

There are 4 position options available.

## Source

```vue
<script setup lang="ts">
import type { CarouselProps } from '@sue/design-web-vue'
import { ref } from 'vue'

type DotPlacement = CarouselProps['dotPlacement']

const dotPlacement = ref<DotPlacement>('top')
</script>

<template>
  <sue-radio-group v-model:value="dotPlacement" style="margin-bottom: 8px">
    <sue-radio-button value="top">
      Top
    </sue-radio-button>
    <sue-radio-button value="bottom">
      Bottom
    </sue-radio-button>
    <sue-radio-button value="start">
      Start
    </sue-radio-button>
    <sue-radio-button value="end">
      End
    </sue-radio-button>
  </sue-radio-group>
  <sue-carousel :dot-placement="dotPlacement">
    <div>
      <h3 class="custom-carousel-item">
        1
      </h3>
    </div>
    <div>
      <h3 class="custom-carousel-item">
        2
      </h3>
    </div>
    <div>
      <h3 class="custom-carousel-item">
        3
      </h3>
    </div>
    <div>
      <h3 class="custom-carousel-item">
        4
      </h3>
    </div>
  </sue-carousel>
</template>
```
