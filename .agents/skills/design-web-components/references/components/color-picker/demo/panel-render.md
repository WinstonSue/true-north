# Custom Render Panel

## Description (en-US)

Rendering of the free control panel via `panelRender`.

## Source

```vue
<script setup lang="ts">
import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors'
import { theme } from '@sue/design-web-vue'
import { computed, shallowRef } from 'vue'

const { useToken } = theme
const { token } = useToken()

const color = shallowRef('#1677ff')
const layoutColor = shallowRef(token.value.colorPrimary)

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }))
}

const presets = computed<any[]>(() => genPresets({
  primary: generate(token.value.colorPrimary),
  red,
  green,
  cyan,
}))
</script>

<template>
  <sue-space vertical>
    <sue-space>
      <span>Add title:</span>
      <sue-color-picker v-model:value="color">
        <template #panelRender="{ panel }">
          <div class="custom-panel">
            <div style="font-size: 12px;color: rgba(0,0,0,.88);line-height: 20px;margin-bottom: 8px">
              Color Picker
            </div>
            <component :is="panel" />
          </div>
        </template>
      </sue-color-picker>
    </sue-space>
    <sue-space>
      <span>Horizontal layout:</span>
      <sue-color-picker
        v-model:value="layoutColor"
        :styles="{ popupOverlayInner: { width: '480px' } }"
        :presets="presets"
      >
        <template #panelRender="{ extra: { components } }">
          <sue-row justify="space-between" :wrap="false">
            <sue-col :span="12">
              <component :is="components.Presets" />
            </sue-col>
            <sue-divider vertical style="height: auto" />
            <sue-col flex="auto">
              <component :is="components.Picker" />
            </sue-col>
          </sue-row>
        </template>
      </sue-color-picker>
    </sue-space>
  </sue-space>
</template>

<style>
.custom-panel {
  width: 100%;
}
</style>
```
