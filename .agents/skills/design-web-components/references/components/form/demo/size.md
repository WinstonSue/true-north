# Form size

## Description (en-US)

Change form size for built-in controls.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  size: 'medium',
  input: '',
  select: undefined as string | undefined,
  switch: true,
})

const selectOptions = [{ label: 'Demo', value: 'demo' }]
</script>

<template>
  <sue-form
    :model="model"
    layout="horizontal"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    :size="model.size as any"
    style="max-width: 600px"
  >
    <sue-form-item label="Form Size" name="size">
      <sue-radio-group v-model:value="model.size">
        <sue-radio-button value="small">
          Small
        </sue-radio-button>
        <sue-radio-button value="medium">
          Middle
        </sue-radio-button>
        <sue-radio-button value="large">
          Large
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Input" name="input">
      <sue-input v-model:value="model.input" />
    </sue-form-item>
    <sue-form-item label="Select" name="select">
      <sue-select v-model:value="model.select" :options="selectOptions" />
    </sue-form-item>
    <sue-form-item label="InputNumber" name="number">
      <sue-input-number style="width: 100%" />
    </sue-form-item>
    <sue-form-item label="Switch" name="switch">
      <sue-switch v-model:checked="model.switch" />
    </sue-form-item>
    <sue-form-item label="Button">
      <sue-button>Button</sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
