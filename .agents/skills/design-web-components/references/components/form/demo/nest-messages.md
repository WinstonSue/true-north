# Nest

## Description (en-US)

Nested fields with custom validation messages.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  user: {
    name: '',
    email: '',
    age: undefined as number | undefined,
    website: '',
    introduction: '',
  },
})

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}

function handleFinish(values: any) {
  console.log(values)
}
</script>

<template>
  <sue-form
    name="nest-messages"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    :validate-messages="validateMessages"
    @finish="handleFinish"
  >
    <sue-form-item :name="['user', 'name']" label="Name" :rules="[{ required: true }]">
      <sue-input v-model:value="model.user.name" />
    </sue-form-item>
    <sue-form-item :name="['user', 'email']" label="Email" :rules="[{ type: 'email' }]">
      <sue-input v-model:value="model.user.email" />
    </sue-form-item>
    <sue-form-item :name="['user', 'age']" label="Age" :rules="[{ type: 'number', min: 0, max: 99 }]">
      <sue-input-number v-model:value="model.user.age" style="width: 100%" />
    </sue-form-item>
    <sue-form-item :name="['user', 'website']" label="Website">
      <sue-input v-model:value="model.user.website" />
    </sue-form-item>
    <sue-form-item :name="['user', 'introduction']" label="Introduction">
      <sue-textarea v-model:value="model.user.introduction" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
