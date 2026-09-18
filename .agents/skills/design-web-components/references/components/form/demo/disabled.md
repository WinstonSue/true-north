# Form disabled

## Description (en-US)

Disable all controls in a form.

## Source

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const componentDisabled = ref(true)
const model = reactive({
  checkbox: true,
  radio: 'apple',
  input: '',
  select: undefined as string | undefined,
  switch: false,
})

const selectOptions = [{ label: 'Demo', value: 'demo' }]
</script>

<template>
  <sue-space direction="vertical" size="medium" style="width: 100%">
    <sue-checkbox v-model:checked="componentDisabled">
      Form disabled
    </sue-checkbox>
    <sue-form
      :model="model"
      layout="horizontal"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      :disabled="componentDisabled"
      style="max-width: 600px"
    >
      <sue-form-item label="Checkbox" name="checkbox">
        <sue-checkbox v-model:checked="model.checkbox">
          Checkbox
        </sue-checkbox>
      </sue-form-item>
      <sue-form-item label="Radio" name="radio">
        <sue-radio-group v-model:value="model.radio">
          <sue-radio value="apple">
            Apple
          </sue-radio>
          <sue-radio value="pear">
            Pear
          </sue-radio>
        </sue-radio-group>
      </sue-form-item>
      <sue-form-item label="Input" name="input">
        <sue-input v-model:value="model.input" />
      </sue-form-item>
      <sue-form-item label="Select" name="select">
        <sue-select v-model:value="model.select" :options="selectOptions" />
      </sue-form-item>
      <sue-form-item label="Switch" name="switch">
        <sue-switch v-model:checked="model.switch" />
      </sue-form-item>
      <sue-form-item label="Button">
        <sue-button>Button</sue-button>
      </sue-form-item>
    </sue-form>
  </sue-space>
</template>
```
