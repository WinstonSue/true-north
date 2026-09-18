# Form methods

## Description (en-US)

Interact with form fields through form instance methods.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  note: '',
  gender: undefined as string | undefined,
  customizeGender: '',
})

const genderOptions = [
  { label: 'male', value: 'male' },
  { label: 'female', value: 'female' },
  { label: 'other', value: 'other' },
]

function handleGenderChange(value: string) {
  switch (value) {
    case 'male':
      model.note = 'Hi, man!'
      break
    case 'female':
      model.note = 'Hi, lady!'
      break
    case 'other':
      model.note = 'Hi there!'
      break
    default:
      break
  }
}

function handleFinish(values: any) {
  console.log(values)
}

function handleReset() {
  formRef.value?.resetFields?.()
}

function handleFill() {
  formRef.value?.setFieldsValue?.({ note: 'Hello world!', gender: 'male' })
}
</script>

<template>
  <sue-form
    ref="formRef"
    name="control-hooks"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <sue-form-item name="note" label="Note" :rules="[{ required: true }]">
      <sue-input v-model:value="model.note" />
    </sue-form-item>
    <sue-form-item name="gender" label="Gender" :rules="[{ required: true }]">
      <sue-select
        v-model:value="model.gender"
        allow-clear
        placeholder="Select a option and change input text above"
        :options="genderOptions"
        @change="handleGenderChange"
      />
    </sue-form-item>
    <sue-form-item v-if="model.gender === 'other'" name="customizeGender" label="Customize Gender" :rules="[{ required: true }]">
      <sue-input v-model:value="model.customizeGender" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-space>
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button html-type="button" @click="handleReset">
          Reset
        </sue-button>
        <sue-button type="link" html-type="button" @click="handleFill">
          Fill form
        </sue-button>
      </sue-space>
    </sue-form-item>
  </sue-form>
</template>
```
