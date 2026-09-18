# Store Form Data into Upper Component

## Description (en-US)

Store form data in outer reactive state.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: 'Antdv Next',
})
</script>

<template>
  <sue-form name="global_state" layout="inline" :model="model">
    <sue-form-item
      name="username"
      label="Username"
      :rules="[{ required: true, message: 'Username is required!' }]"
    >
      <sue-input v-model:value="model.username" />
    </sue-form-item>
  </sue-form>
  <sue-editable-paragraph style="max-width: 440px; margin-top: 24px">
    <pre style="border: none">{{ JSON.stringify(model, null, 2) }}</pre>
  </sue-editable-paragraph>
</template>
```
