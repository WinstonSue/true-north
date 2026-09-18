# Dynamic Form nest Items

## Description (en-US)

Dynamic nested form items.

## Source

```vue
<script setup lang="ts">
import { CircleMinus, Plus } from '@lucide/vue'
import { reactive } from 'vue'

const model = reactive({
  users: [
    { first: '', last: '' },
  ],
})

function addUser() {
  model.users.push({ first: '', last: '' })
}

function removeUser(index: number) {
  model.users.splice(index, 1)
}

function handleFinish(values: any) {
  console.log('Received values of form:', values)
}
</script>

<template>
  <sue-form
    name="dynamic_form_nest_item"
    :model="model"
    style="max-width: 600px"
    auto-complete="off"
    @finish="handleFinish"
  >
    <sue-space v-for="(user, index) in model.users" :key="`user-${index}`" align="baseline" style="display: flex; margin-bottom: 8px">
      <sue-form-item
        :name="['users', index, 'first']"
        :rules="[{ required: true, message: 'Missing first name' }]"
      >
        <sue-input v-model:value="user.first" placeholder="First Name" />
      </sue-form-item>
      <sue-form-item
        :name="['users', index, 'last']"
        :rules="[{ required: true, message: 'Missing last name' }]"
      >
        <sue-input v-model:value="user.last" placeholder="Last Name" />
      </sue-form-item>
      <CircleMinus @click="removeUser(index)" />
    </sue-space>

    <sue-form-item>
      <sue-button type="dashed" block @click="addUser">
        <template #icon>
          <Plus />
        </template>
        Add field
      </sue-button>
    </sue-form-item>

    <sue-form-item>
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
