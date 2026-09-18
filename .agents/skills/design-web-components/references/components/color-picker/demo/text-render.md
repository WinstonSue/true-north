# Rendering Trigger Text

## Description (en-US)

Renders the default text of the trigger, effective when `showText` is `true`. When customizing text, you can use `showText` as a function to return custom text.

## Source

```vue
<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { shallowRef } from 'vue'

const value = shallowRef('#1677ff')
const customTextColor = shallowRef('#1677ff')
const iconColor = shallowRef('#1677ff')
const open = shallowRef(false)
</script>

<template>
  <sue-space vertical>
    <sue-color-picker v-model:value="value" show-text allow-clear />
    <sue-color-picker v-model:value="customTextColor">
      <template #showText="{ color }">
        <span>Custom Text ({{ color?.toHexString?.() }})</span>
      </template>
    </sue-color-picker>
    <sue-color-picker
      v-model:value="iconColor"
      v-model:open="open"
    >
      <template #showText>
        <ChevronDown :rotate="open ? 180 : 0" style="color: rgba(0, 0, 0, 0.25)" />
      </template>
    </sue-color-picker>
  </sue-space>
</template>
```
