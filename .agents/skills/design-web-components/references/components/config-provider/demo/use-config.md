# useConfig

## Description (en-US)

Get the value of the parent `Provider`. Such as `DisabledContextProvider`, `SizeContextProvider`.

## Source

```vue
<script setup lang="ts">
import type { ConfigProviderProps } from '@sue/design-web-vue'
import { ref } from 'vue'
import ConfigDisplay from './use-config-display.vue'

type SizeType = ConfigProviderProps['componentSize']

const componentSize = ref<SizeType>('small')
const disabled = ref(true)
</script>

<template>
  <div>
    <sue-space>
      <sue-radio-group v-model:value="componentSize">
        <sue-radio-button value="small">
          Small
        </sue-radio-button>
        <sue-radio-button value="medium">
          Middle
        </sue-radio-button>
        <sue-radio-button value="large">
          Large
        </sue-radio-button>
      </sue-radio-group>
      <sue-checkbox v-model:checked="disabled">
        Form disabled
      </sue-checkbox>
    </sue-space>
    <sue-divider />
    <sue-config-provider :component-size="componentSize">
      <div class="example">
        <sue-form :disabled="disabled">
          <ConfigDisplay />
        </sue-form>
      </div>
    </sue-config-provider>
  </div>
</template>
```
