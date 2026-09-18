# Customize clear button

## Description (en-US)

Customize clear button

## Source

```vue
<script setup lang="ts">
import { SquareX } from '@lucide/vue'
import { h, ref } from 'vue'

const options = ref<{ value: string }[]>([])

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) })

function getPanelValue(searchText: string) {
  return searchText
    ? [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    : []
}

function handleSearch(text: string) {
  options.value = getPanelValue(text)
}

const clearIcon = h(SquareX)
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-auto-complete
      :options="options"
      style="width: 200px"
      :show-search="{ onSearch: handleSearch }"
      placeholder="UnClearable"
      :allow-clear="false"
    />
    <sue-auto-complete
      :options="options"
      style="width: 200px"
      :show-search="{ onSearch: handleSearch }"
      placeholder="Customized clear icon"
      :allow-clear="{ clearIcon }"
    />
  </sue-flex>
</template>
```
