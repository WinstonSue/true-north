# Login Form

## Description (en-US)

Login form example.

## Source

```vue
<script setup lang="ts">
import { Lock, User } from '@lucide/vue'
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
  remember: true,
})

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <sue-form name="login" :model="model" style="max-width: 360px" @finish="handleFinish">
    <sue-form-item
      name="username"
      :rules="[{ required: true, message: 'Please input your Username!' }]"
    >
      <sue-input v-model:value="model.username" placeholder="Username">
        <template #prefix>
          <User />
        </template>
      </sue-input>
    </sue-form-item>
    <sue-form-item
      name="password"
      :rules="[{ required: true, message: 'Please input your Password!' }]"
    >
      <sue-input v-model:value="model.password" type="password" placeholder="Password">
        <template #prefix>
          <Lock />
        </template>
      </sue-input>
    </sue-form-item>
    <sue-form-item>
      <sue-flex justify="space-between" align="center">
        <sue-form-item name="remember" no-style>
          <sue-checkbox v-model:checked="model.remember">
            Remember me
          </sue-checkbox>
        </sue-form-item>
        <a href="">
          Forgot password
        </a>
      </sue-flex>
    </sue-form-item>

    <sue-form-item>
      <sue-button block type="primary" html-type="submit">
        Log in
      </sue-button>
      or <a href="">Register now!</a>
    </sue-form-item>
  </sue-form>
</template>
```
