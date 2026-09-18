# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type Placement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

const placement = shallowRef<Placement>('topLeft')
const value = shallowRef('HangZhou')

const options = [
  { value: 'HangZhou', label: 'HangZhou #310000' },
  { value: 'NingBo', label: 'NingBo #315000' },
  { value: 'WenZhou', label: 'WenZhou #325000' },
]
</script>

<template>
  <sue-radio-group v-model:value="placement">
    <sue-radio-button value="topLeft">
      topLeft
    </sue-radio-button>
    <sue-radio-button value="topRight">
      topRight
    </sue-radio-button>
    <sue-radio-button value="bottomLeft">
      bottomLeft
    </sue-radio-button>
    <sue-radio-button value="bottomRight">
      bottomRight
    </sue-radio-button>
  </sue-radio-group>
  <br>
  <br>
  <sue-select
    v-model:value="value"
    style="width: 120px"
    :popup-match-select-width="false"
    :placement="placement"
    :options="options"
  />
</template>
```
