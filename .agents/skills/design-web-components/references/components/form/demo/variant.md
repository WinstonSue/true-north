# Form variants

## Description (en-US)

Switch variants for inputs inside form.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  variant: 'outlined',
  username: '',
  password: '',
})

const variantOptions = [
  { label: 'outlined', value: 'outlined' },
  { label: 'filled', value: 'filled' },
  { label: 'borderless', value: 'borderless' },
  { label: 'underlined', value: 'underlined' },
]
</script>

<template>
  <sue-form
    :model="model"
    layout="vertical"
    :variant="model.variant as any"
    style="max-width: 600px"
  >
    <sue-form-item label="Variant" name="variant">
      <sue-radio-group v-model:value="model.variant">
        <sue-radio-button v-for="item in variantOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Username" name="username" :rules="[{ required: true }]">
      <sue-input v-model:value="model.username" placeholder="username" />
    </sue-form-item>
    <sue-form-item label="Password" name="password" :rules="[{ required: true }]">
      <sue-input-password v-model:value="model.password" placeholder="password" />
    </sue-form-item>
  </sue-form>
</template>
```
