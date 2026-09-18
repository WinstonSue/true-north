# Dynamic Form Item

## Description (en-US)

Add and remove form items dynamically.

## Source

```vue
<script setup lang="ts">
import { CircleMinus, Plus } from '@lucide/vue'
import { reactive } from 'vue'

const model = reactive({
  names: [''],
})

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
}

const formItemLayoutWithoutLabel = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 4 } },
}

function addField(value = '') {
  model.names.push(value)
}

function addFieldAtHead() {
  model.names.unshift('The head item')
}

function removeField(index: number) {
  model.names.splice(index, 1)
}

function handleFinish(values: any) {
  console.log('Received values of form:', values)
}
</script>

<template>
  <sue-form
    name="dynamic_form_item"
    :model="model"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <template v-for="(item, index) in model.names" :key="`passenger-${index}`">
      <sue-form-item
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithoutLabel"
        :label="index === 0 ? 'Passengers' : ''"
        :name="['names', index]"
        :rules="[{ required: true, message: 'Please input passenger\'s name or delete this field.' }]"
      >
        <sue-input v-model:value="model.names[index]" placeholder="passenger name" style="width: 60%" />
        <CircleMinus
          v-if="model.names.length > 1"
          class="dynamic-delete-button"
          style="margin-left: 8px"
          @click="removeField(index)"
        />
      </sue-form-item>
    </template>

    <sue-form-item v-bind="formItemLayoutWithoutLabel">
      <sue-space direction="vertical" style="width: 60%">
        <sue-button type="dashed" block @click="addField()">
          <template #icon>
            <Plus />
          </template>
          Add field
        </sue-button>
        <sue-button type="dashed" block @click="addFieldAtHead">
          <template #icon>
            <Plus />
          </template>
          Add field at head
        </sue-button>
      </sue-space>
    </sue-form-item>

    <sue-form-item v-bind="formItemLayoutWithoutLabel">
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
