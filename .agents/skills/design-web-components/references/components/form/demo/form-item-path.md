# Path Prefix

## Description (en-US)

Use nested paths for field names.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  user: {
    name: '',
    contact: {
      email: '',
    },
  },
  addresses: [
    { city: '', street: '' },
  ],
})
</script>

<template>
  <sue-form layout="vertical" :model="model" style="max-width: 600px">
    <sue-form-item :name="['user', 'name']" label="User Name" :rules="[{ required: true }]">
      <sue-input v-model:value="model.user.name" />
    </sue-form-item>
    <sue-form-item :name="['user', 'contact', 'email']" label="Email" :rules="[{ type: 'email' }]">
      <sue-input v-model:value="model.user.contact.email" />
    </sue-form-item>
    <sue-form-item label="Address">
      <sue-space direction="vertical" style="width: 100%">
        <sue-form-item :name="['addresses', 0, 'city']" label="City" :rules="[{ required: true }]">
          <sue-input v-model:value="model.addresses[0].city" />
        </sue-form-item>
        <sue-form-item :name="['addresses', 0, 'street']" label="Street">
          <sue-input v-model:value="model.addresses[0].street" />
        </sue-form-item>
      </sue-space>
    </sue-form-item>
  </sue-form>
</template>
```
