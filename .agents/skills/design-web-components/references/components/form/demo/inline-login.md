# Inline Login Form

## Description (en-US)

Inline login form.

## Source

```vue
<script setup lang="ts">
import { Lock, User } from '@lucide/vue'
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
})

function handleFinish(values: any) {
  console.log('Finish:', values)
}
</script>

<template>
  <sue-form name="horizontal_login" layout="inline" :model="model" @finish="handleFinish">
    <sue-form-item name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
      <sue-input v-model:value="model.username" placeholder="Username">
        <template #prefix>
          <User />
        </template>
      </sue-input>
    </sue-form-item>
    <sue-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
      <sue-input v-model:value="model.password" type="password" placeholder="Password">
        <template #prefix>
          <Lock />
        </template>
      </sue-input>
    </sue-form-item>
    <sue-form-item>
      <sue-button type="primary" html-type="submit">
        Log in
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
