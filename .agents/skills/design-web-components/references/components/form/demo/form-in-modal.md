# Form in Modal to Create

## Description (en-US)

Use form inside modal.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { reactive, ref, shallowRef } from 'vue'

interface Values {
  title?: string
  description?: string
  modifier?: string
}

const formRef = shallowRef<FormInstance>()
const open = ref(false)
const formValues = ref<Values>()

const model = reactive({
  title: '',
  description: '',
  modifier: 'public',
})

function handleCreate(values: Values) {
  console.log('Received values of form: ', values)
  formValues.value = values
  open.value = false
}
</script>

<template>
  <sue-space direction="vertical" style="width: 100%">
    <sue-button type="primary" @click="open = true">
      New Collection
    </sue-button>
    <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
  </sue-space>

  <sue-modal
    v-model:open="open"
    title="Create a new collection"
    ok-text="Create"
    cancel-text="Cancel"
    :ok-button-props="{ autoFocus: true, htmlType: 'submit' }"
    @cancel="open = false"
    @ok="formRef?.submit?.()"
  >
    <sue-form
      ref="formRef"
      layout="vertical"
      name="form_in_modal"
      :model="model"
      clear-on-destroy
      @finish="handleCreate"
    >
      <sue-form-item
        name="title"
        label="Title"
        :rules="[{ required: true, message: 'Please input the title of collection!' }]"
      >
        <sue-input v-model:value="model.title" />
      </sue-form-item>
      <sue-form-item name="description" label="Description">
        <sue-textarea v-model:value="model.description" />
      </sue-form-item>
      <sue-form-item name="modifier" class="collection-create-form_last-form-item">
        <sue-radio-group v-model:value="model.modifier">
          <sue-radio value="public">
            Public
          </sue-radio>
          <sue-radio value="private">
            Private
          </sue-radio>
        </sue-radio-group>
      </sue-form-item>
    </sue-form>
  </sue-modal>
</template>
```
