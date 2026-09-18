# Preset Colors

## Description (en-US)

Set the presets color of the color picker.

## Source

```vue
<script setup lang="ts">
import { generate, green, presetPalettes, red } from '@ant-design/colors'
import { theme } from '@sue/design-web-vue'
import { computed, shallowRef } from 'vue'

const { useToken } = theme
const { token } = useToken()

const color = shallowRef('#1677ff')

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }))
}

const presets = computed(() => genPresets({
  primary: generate(token.value.colorPrimary),
  red,
  green,
}) as any[])
</script>

<template>
  <sue-color-picker v-model:value="color" :presets="presets" />
</template>
```
