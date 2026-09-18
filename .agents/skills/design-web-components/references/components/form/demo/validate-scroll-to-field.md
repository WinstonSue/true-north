# Slide to error field

## Description (en-US)

When validation fails or manually scroll to the error field.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()

const model = reactive({
  username: '',
  occupation: '',
  motto: '',
  bio: '',
})
</script>

<template>
  <sue-form
    ref="formRef"
    :model="model"
    :scroll-to-first-error="{ behavior: 'instant', block: 'end', focus: true }"
    style="padding-block: 32px"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
  >
    <sue-form-item>
      <sue-button @click="() => formRef?.scrollToField?.('bio')">
        Scroll to Bio
      </sue-button>
    </sue-form-item>
    <sue-form-item name="username" label="Username" :rules="[{ required: true }]">
      <sue-input v-model:value="model.username" />
    </sue-form-item>
    <sue-form-item label="Occupation" name="occupation">
      <sue-select
        v-model:value="model.occupation"
        class="w-full" :options="[
          { label: 'Designer', value: 'designer' },
          { label: 'Developer', value: 'developer' },
          { label: 'Product Manager', value: 'product-manager' },
        ]"
      />
    </sue-form-item>
    <sue-form-item label="Motto" name="motto">
      <sue-textarea v-model:value="model.motto" :rows="4" />
    </sue-form-item>
    <sue-form-item label="Bio" name="bio" :rules="[{ required: true }]">
      <sue-textarea v-model:value="model.bio" :rows="6" />
    </sue-form-item>
    <sue-form-item>
      <sue-flex gap="small">
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button danger @click="() => formRef?.resetFields?.()">
          Reset
        </sue-button>
      </sue-flex>
    </sue-form-item>
  </sue-form>
</template>
```
