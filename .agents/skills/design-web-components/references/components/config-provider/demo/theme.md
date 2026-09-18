# Theme

## Description (en-US)

Modify theme by `theme` prop.

## Source

```vue
<script setup lang="ts">
import type { Color } from '@sue/design-web-vue'
import { computed, reactive } from 'vue'

interface ThemeData {
  borderRadius: number
  colorPrimary: string
  Button?: {
    colorPrimary: string
    algorithm?: boolean
  }
}

const formState = reactive<ThemeData>({
  borderRadius: 6,
  colorPrimary: '#1677ff',
  Button: {
    colorPrimary: '#00B96B',
    algorithm: false,
  },
})

const themeConfig = computed(() => ({
  token: {
    colorPrimary: formState.colorPrimary,
    borderRadius: formState.borderRadius,
  },
  components: {
    Button: {
      colorPrimary: formState.Button?.colorPrimary,
      algorithm: formState.Button?.algorithm,
    },
  },
}))

function handlePrimaryChange(color: Color) {
  formState.colorPrimary = color.toHexString()
}

function handleButtonColorChange(color: Color) {
  if (!formState.Button) {
    formState.Button = { colorPrimary: color.toHexString() }
    return
  }
  formState.Button.colorPrimary = color.toHexString()
}
</script>

<template>
  <div>
    <sue-config-provider :theme="themeConfig">
      <sue-space>
        <sue-input />
        <sue-button type="primary">
          Button
        </sue-button>
      </sue-space>
    </sue-config-provider>
    <sue-divider />
    <sue-form
      :model="formState"
      name="theme"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <sue-form-item name="colorPrimary" label="Primary Color">
        <sue-color-picker :value="formState.colorPrimary" @change-complete="handlePrimaryChange" />
      </sue-form-item>
      <sue-form-item name="borderRadius" label="Border Radius">
        <sue-input-number v-model:value="formState.borderRadius" />
      </sue-form-item>
      <sue-form-item label="Button">
        <sue-form-item :name="['Button', 'algorithm']" label="algorithm" :label-col="{ span: 6 }">
          <sue-switch v-model:checked="formState.Button!.algorithm" />
        </sue-form-item>
        <sue-form-item :name="['Button', 'colorPrimary']" label="Primary Color" :label-col="{ span: 6 }">
          <sue-color-picker :value="formState.Button?.colorPrimary" @change-complete="handleButtonColorChange" />
        </sue-form-item>
      </sue-form-item>
      <sue-form-item name="submit" :wrapper-col="{ offset: 4, span: 20 }">
        <sue-button type="primary">
          Submit
        </sue-button>
      </sue-form-item>
    </sue-form>
  </div>
</template>
```
