# Focus

## Description (en-US)

Focus with additional option.

## Source

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const value = ref(999)
const inputRef = useTemplateRef('input')
function handleFocus(options: unknown) {
  inputRef.value?.focus(options)
}
</script>

<template>
  <sue-space vertical style="width: 100%;">
    <sue-space wrap>
      <sue-button @click="() => handleFocus({ cursor: 'start' })">
        Focus at first
      </sue-button>
      <sue-button @click="() => handleFocus({ cursor: 'end' })">
        Focus at last
      </sue-button>
      <sue-button @click="() => handleFocus({ cursor: 'all' })">
        Focus to select all
      </sue-button>
      <sue-button @click="() => handleFocus({ preventScroll: true })">
        Focus prevent scroll
      </sue-button>
    </sue-space>
    <sue-input-number ref="input" v-model:value="value" style="width: 100%;" />
  </sue-space>
</template>
```
