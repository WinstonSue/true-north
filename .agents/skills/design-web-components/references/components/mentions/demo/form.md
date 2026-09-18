# With Form

## Description (en-US)

Controlled mode, for example, to work with `Form`.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { Mentions } from '@sue/design-web-vue'
import { reactive, shallowRef } from 'vue'

const model = reactive({
  coders: '',
  bio: '',
})

const formRef = shallowRef<FormInstance>()

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
]

function handleFinish(values: any) {
  console.log('Submit:', values)
}

function handleFinishFailed(errorInfo: any) {
  console.log('Error:', errorInfo)
}

function handleReset() {
  formRef.value?.resetFields?.()
}

async function checkMention(_rule: any, value: string) {
  const mentions = Mentions.getMentions(value || '')
  if (mentions.length < 2) {
    throw new Error('More than one must be selected!')
  }
}
</script>

<template>
  <sue-form
    ref="formRef"
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <sue-form-item name="coders" label="Top coders" :rules="[{ validator: checkMention }]">
      <sue-mentions v-model:value="model.coders" :rows="1" :options="options" />
    </sue-form-item>
    <sue-form-item name="bio" label="Bio" :rules="[{ required: true, message: 'Please enter your bio!' }]">
      <sue-mentions
        v-model:value="model.bio"
        :rows="3"
        placeholder="You can use @ to ref user here"
        :options="options"
      />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-space wrap>
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button html-type="button" @click="handleReset">
          Reset
        </sue-button>
      </sue-space>
    </sue-form-item>
  </sue-form>
</template>
```
