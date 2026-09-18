# Text & icon

## Description (en-US)

With text and icon.

## Source

```vue
<script setup lang="ts">
import { Check, X } from '@lucide/vue'
import { shallowRef } from 'vue'

const checked = shallowRef(true)
const checked1 = shallowRef(false)
const checked2 = shallowRef(true)
</script>

<template>
  <sue-space vertical>
    <sue-switch v-model:checked="checked" checked-children="开启" un-checked-children="关闭" />
    <sue-switch v-model:checked="checked1" checked-children="1" un-checked-children="0" />
    <sue-switch v-model:checked="checked2">
      <template #checkedChildren>
        <Check />
      </template>
      <template #unCheckedChildren>
        <X />
      </template>
    </sue-switch>
  </sue-space>
</template>
```
