# Control between forms

## Description (en-US)

Coordinate data between multiple forms.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { Smile, User } from '@lucide/vue'
import { reactive, ref, shallowRef } from 'vue'

interface UserType { name: string, age: number }

const open = ref(false)
const users = ref<UserType[]>([])

const mainForm = reactive({
  group: '',
})

const userForm = reactive({
  name: '',
  age: undefined as number | undefined,
})

const userFormRef = shallowRef<FormInstance>()

function showUserModal() {
  open.value = true
}

function hideUserModal() {
  open.value = false
  userFormRef.value?.resetFields?.()
}

function handleUserFinish(values: any) {
  users.value = [...users.value, values as UserType]
  hideUserModal()
}

function handleFinish(values: any) {
  console.log('Finish:', values)
}
</script>

<template>
  <sue-form
    name="basicForm"
    :model="mainForm"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <sue-form-item name="group" label="Group Name" :rules="[{ required: true }]">
      <sue-input v-model:value="mainForm.group" />
    </sue-form-item>

    <sue-form-item label="User List">
      <sue-flex v-if="users.length" vertical gap="8">
        <sue-space v-for="user in users" :key="`${user.name}-${user.age}`">
          <sue-avatar>
            <User />
          </sue-avatar>
          {{ `${user.name} - ${user.age}` }}
        </sue-space>
      </sue-flex>
      <sue-editable-text v-else type="secondary" class="sue-form-text">
        (<Smile /> No user yet.)
      </sue-editable-text>
    </sue-form-item>

    <sue-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <sue-button html-type="submit" type="primary">
        Submit
      </sue-button>
      <sue-button html-type="button" style="margin-left: 8px" @click="showUserModal">
        Add User
      </sue-button>
    </sue-form-item>
  </sue-form>

  <sue-modal
    v-model:open="open"
    title="Add User"
    ok-text="Create"
    cancel-text="Cancel"
    @cancel="hideUserModal"
    @ok="userFormRef?.submit?.()"
  >
    <sue-form ref="userFormRef" layout="vertical" name="userForm" :model="userForm" @finish="handleUserFinish">
      <sue-form-item name="name" label="User Name" :rules="[{ required: true }]">
        <sue-input v-model:value="userForm.name" />
      </sue-form-item>
      <sue-form-item name="age" label="User Age" :rules="[{ required: true }]">
        <sue-input-number v-model:value="userForm.age" style="width: 100%" />
      </sue-form-item>
    </sue-form>
  </sue-modal>
</template>
```
