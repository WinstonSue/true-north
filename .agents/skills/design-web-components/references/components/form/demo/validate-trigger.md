# Validate Trigger

## Description (en-US)

Configure validate trigger timing for fields.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  blurInput: '',
  changeInput: '',
})
</script>

<template>
  <sue-form layout="vertical" :model="model" style="max-width: 600px">
    <sue-form-item
      name="blurInput"
      label="Validate on Blur"
      validate-trigger="blur"
      :rules="[{ required: true, message: 'Please input on blur.' }]"
    >
      <sue-input v-model:value="model.blurInput" placeholder="blur to validate" />
    </sue-form-item>
    <sue-form-item
      name="changeInput"
      label="Validate on Change"
      validate-trigger="change"
      :rules="[{ required: true, message: 'Please input on change.' }]"
    >
      <sue-input v-model:value="model.changeInput" placeholder="change to validate" />
    </sue-form-item>
  </sue-form>
</template>
```
