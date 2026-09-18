# Dependencies

## Description (en-US)

Validate fields based on other field values.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { reactive, shallowRef, watch } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  password: '',
  password2: '',
})

watch(
  () => model.password,
  () => {
    if (model.password2) {
      formRef.value?.validateFields?.(['password2'])
    }
  },
)

const confirmRules = [
  { required: true },
  {
    validator: async (_rule: any, value: string) => {
      if (!value || value === model.password) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('The new password that you entered do not match!'))
    },
  },
]
</script>

<template>
  <sue-form
    ref="formRef"
    name="dependencies"
    :model="model"
    auto-complete="off"
    style="max-width: 600px"
    layout="vertical"
  >
    <sue-alert title="Try modify `Password2` and then modify `Password`" type="info" show-icon />

    <sue-form-item label="Password" name="password" :rules="[{ required: true }]">
      <sue-input v-model:value="model.password" />
    </sue-form-item>

    <sue-form-item label="Confirm Password" name="password2" :rules="confirmRules">
      <sue-input v-model:value="model.password2" />
    </sue-form-item>

    <div>
      <p>
        Only update when <code>password2</code> changed:
      </p>
      <pre>{{ JSON.stringify(model, null, 2) }}</pre>
    </div>
  </sue-form>
</template>
```
