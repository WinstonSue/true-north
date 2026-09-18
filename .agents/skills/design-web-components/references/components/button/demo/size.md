# Size

## Description (en-US)

Antdv Next supports three sizes of buttons: small, medium and large.

If a large or small button is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a button with the medium size.

## Source

```vue
<script setup lang="ts">
import type { SizeType } from '@sue/design-web-vue'
import { Download } from '@lucide/vue'
import { ref } from 'vue'

const size = ref<SizeType>('large')
</script>

<template>
  <sue-radio-group v-model:value="size">
    <sue-radio-button value="large">
      Large
    </sue-radio-button>
    <sue-radio-button value="medium">
      Medium
    </sue-radio-button>
    <sue-radio-button value="small">
      Small
    </sue-radio-button>
  </sue-radio-group>
  <sue-divider title-placement="start" plain>
    Preview
  </sue-divider>
  <sue-flex gap="small" align="flex-start" vertical>
    <sue-flex gap="small" wrap>
      <sue-button type="primary" :size="size">
        Primary
      </sue-button>
      <sue-button :size="size">
        Default
      </sue-button>
      <sue-button type="dashed" :size="size">
        Dashed
      </sue-button>
    </sue-flex>
    <sue-button type="link" :size="size">
      Link
    </sue-button>
    <sue-flex gap="small" wrap>
      <sue-button type="primary" :size="size">
        <template #icon>
          <Download />
        </template>
      </sue-button>
      <sue-button type="primary" shape="circle" :size="size">
        <template #icon>
          <Download />
        </template>
      </sue-button>
      <sue-button type="primary" shape="round" :size="size">
        <template #icon>
          <Download />
        </template>
      </sue-button>
      <sue-button type="primary" shape="round" :size="size">
        <template #icon>
          <Download />
        </template>
        Download
      </sue-button>
      <sue-button type="primary" :size="size">
        <template #icon>
          <Download />
        </template>
        Download
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
