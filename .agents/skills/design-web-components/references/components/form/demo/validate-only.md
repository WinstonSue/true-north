# Validate Only

## Description (en-US)

Validate only without triggering UI status updates.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { message } from '@sue/design-web-vue'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  username: '',
  password: '',
})

async function handleValidateOnly() {
  try {
    await formRef.value?.validateFields?.(['username', 'password'], { validateOnly: true })
    message.success('Validate only success')
  }
  catch {
    message.error('Validate only failed')
  }
}
</script>

<template>
  <sue-form ref="formRef" layout="vertical" :model="model" style="max-width: 600px">
    <sue-form-item name="username" label="Username" :rules="[{ required: true }]">
      <sue-input v-model:value="model.username" placeholder="username" />
    </sue-form-item>
    <sue-form-item name="password" label="Password" :rules="[{ required: true }]">
      <sue-input-password v-model:value="model.password" placeholder="password" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-space>
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button html-type="button" @click="handleValidateOnly">
          Validate Only
        </sue-button>
      </sue-space>
    </sue-form-item>
  </sue-form>
</template>
```
