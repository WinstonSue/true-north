# No block rule

## Description (en-US)

Use warningOnly rules without blocking submit.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { message } from '@sue/design-web-vue'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  url: '',
})

const rules = [
  { required: true },
  { type: 'url', warningOnly: true },
  { type: 'string', min: 6 },
]

function handleFinish() {
  message.success('Submit success!')
}

function handleFinishFailed() {
  message.error('Submit failed!')
}

function handleFill() {
  formRef.value?.setFieldsValue?.({ url: 'https://taobao.com/' })
}
</script>

<template>
  <sue-form
    ref="formRef"
    layout="vertical"
    :model="model"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <sue-form-item name="url" label="URL" :rules="rules">
      <sue-input v-model:value="model.url" placeholder="input placeholder" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-space>
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button html-type="button" @click="handleFill">
          Fill
        </sue-button>
      </sue-space>
    </sue-form-item>
  </sue-form>
</template>
```
