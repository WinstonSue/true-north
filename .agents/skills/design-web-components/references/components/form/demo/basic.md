# Basic Usage

## Description (en-US)

Basic form usage.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { reactive, shallowRef } from 'vue'

const model = reactive({
  username: '',
  password: '',
  remember: true,
})
function handleFinished(values: any) {
  console.log('Success:', values)
}
function handleFinishFailed(errorInfo: any) {
  console.log('Failed:', errorInfo)
}
const formRef = shallowRef<FormInstance>()
</script>

<template>
  <sue-form
    ref="formRef"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    auto-complete="off"
    @finish="handleFinished"
    @finish-failed="handleFinishFailed"
  >
    <sue-form-item name="username" label="Username" :rules="[{ required: true, message: 'Please input your username!' }]">
      <sue-input v-model:value="model.username" />
    </sue-form-item>
    <sue-form-item name="password" label="Password" :rules="[{ required: true, message: 'Please input your password!' }]">
      <sue-input-password v-model:value="model.password" />
    </sue-form-item>
    <sue-form-item name="remember" :label="null">
      <sue-checkbox v-model:checked="model.remember">
        Remember me!
      </sue-checkbox>
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
