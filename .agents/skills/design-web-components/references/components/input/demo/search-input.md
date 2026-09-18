# Search box

## Description (en-US)

Example of creating a search box by grouping a standard input with a search button.

## Source

```vue
<script setup lang="ts">
import { Volume2 } from '@lucide/vue'

function onSearch(value: string, _e?: Event, info?: { source?: string }) {
  console.log(info?.source, value)
}
</script>

<template>
  <sue-space direction="vertical">
    <sue-input-search placeholder="input search text" style="width: 200px;" @search="onSearch" />
    <sue-input-search placeholder="input search text" allow-clear style="width: 200px;" @search="onSearch" />
    <sue-space-compact>
      <sue-space-addon>https://</sue-space-addon>
      <sue-input-search placeholder="input search text" allow-clear @search="onSearch" />
    </sue-space-compact>

    <sue-input-search placeholder="input search text" enter-button @search="onSearch" />
    <sue-input-search
      placeholder="input search text"
      allow-clear
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <sue-input-search
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    >
      <template #suffix>
        <Volume2 style="font-size: 16px; color: #1677ff;" />
      </template>
    </sue-input-search>
  </sue-space>
</template>
```
