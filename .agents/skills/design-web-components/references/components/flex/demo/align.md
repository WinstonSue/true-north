# align

## Description (en-US)

Set align.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref } from 'vue'

const justifyOptions = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
]

const alignOptions = ['flex-start', 'center', 'flex-end']
const justify = ref(justifyOptions[0])
const alignItems = ref(alignOptions[0])
const boxStyle: CSSProperties = {
  width: '100%',
  height: '120px',
  borderRadius: '6px',
  border: '1px solid #40a9ff',
}
</script>

<template>
  <sue-flex gap="middle" align="start" vertical>
    <p>Select justify :</p>
    <sue-segmented v-model:value="justify" :options="justifyOptions" />
    <p>Select align :</p>
    <sue-segmented v-model:value="alignItems" :options="alignOptions" />
    <sue-flex :style="{ ...boxStyle }" :justify="justify" :align="alignItems">
      <sue-button type="primary">
        Primary
      </sue-button>
      <sue-button type="primary">
        Primary
      </sue-button>
      <sue-button type="primary">
        Primary
      </sue-button>
      <sue-button type="primary">
        Primary
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
