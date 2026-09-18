# Submit form in drawer

## Description (en-US)

Use a form in Drawer with bottom actions. Wrap body content with Flex `full -> fill + fixed` so the form scrolls and actions stay at the bottom.

## Source

```vue
<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { reactive, ref } from 'vue'

const open = ref(false)

const formState = reactive({
  name: '',
  url: '',
  owner: undefined as string | undefined,
  type: undefined as string | undefined,
  approver: undefined as string | undefined,
  dateTime: undefined as any,
  description: '',
})

const ownerOptions = [
  { label: 'Xiaoxiao Fu', value: 'xiao' },
  { label: 'Maomao Zhou', value: 'mao' },
]
const typeOptions = [
  { label: 'private', value: 'private' },
  { label: 'public', value: 'public' },
]
const approverOptions = [
  { label: 'Jack Ma', value: 'jack' },
  { label: 'Tom Liu', value: 'tom' },
]
</script>

<template>
  <sue-button type="primary" @click="open = true">
    <template #icon>
      <Plus />
    </template>
    New account
  </sue-button>
  <sue-drawer
    v-model:open="open"
    title="Create a new account"
    :size="720"
    @close="open = false"
  >
    <sue-flex vertical container="full">
      <sue-flex container="fill" style="overflow: auto; padding: 24px;">
        <sue-form layout="vertical" :model="formState" :required-mark="false">
          <sue-row :gutter="16">
            <sue-col :span="12">
              <sue-form-item
                name="name"
                label="Name"
                :rules="[{ required: true, message: 'Please enter user name' }]"
              >
                <sue-input v-model:value="formState.name" placeholder="Please enter user name" />
              </sue-form-item>
            </sue-col>
            <sue-col :span="12">
              <sue-form-item
                name="url"
                label="Url"
                :rules="[{ required: true, message: 'Please enter url' }]"
              >
                <sue-space-compact block>
                  <sue-space-addon>http://</sue-space-addon>
                  <sue-input v-model:value="formState.url" placeholder="Please enter url" />
                  <sue-space-addon>.com</sue-space-addon>
                </sue-space-compact>
              </sue-form-item>
            </sue-col>
          </sue-row>
          <sue-row :gutter="16">
            <sue-col :span="12">
              <sue-form-item
                name="owner"
                label="Owner"
                :rules="[{ required: true, message: 'Please select an owner' }]"
              >
                <sue-select
                  v-model:value="formState.owner"
                  placeholder="Please select an owner"
                  :options="ownerOptions"
                />
              </sue-form-item>
            </sue-col>
            <sue-col :span="12">
              <sue-form-item
                name="type"
                label="Type"
                :rules="[{ required: true, message: 'Please choose the type' }]"
              >
                <sue-select
                  v-model:value="formState.type"
                  placeholder="Please choose the type"
                  :options="typeOptions"
                />
              </sue-form-item>
            </sue-col>
          </sue-row>
          <sue-row :gutter="16">
            <sue-col :span="12">
              <sue-form-item
                name="approver"
                label="Approver"
                :rules="[{ required: true, message: 'Please choose the approver' }]"
              >
                <sue-select
                  v-model:value="formState.approver"
                  placeholder="Please choose the approver"
                  :options="approverOptions"
                />
              </sue-form-item>
            </sue-col>
            <sue-col :span="12">
              <sue-form-item
                name="dateTime"
                label="DateTime"
                :rules="[{ required: true, message: 'Please choose the dateTime' }]"
              >
                <sue-range-picker
                  v-model:value="formState.dateTime"
                  style="width: 100%"
                  :get-popup-container="(trigger) => trigger.parentElement || document.body"
                />
              </sue-form-item>
            </sue-col>
          </sue-row>
          <sue-row :gutter="16">
            <sue-col :span="24">
              <sue-form-item
                name="description"
                label="Description"
                :rules="[{ required: true, message: 'please enter url description' }]"
              >
                <sue-textarea v-model:value="formState.description" :rows="4" placeholder="please enter url description" />
              </sue-form-item>
            </sue-col>
          </sue-row>
        </sue-form>
      </sue-flex>
      <sue-flex
        container="fixed"
        justify="flex-end"
        style="padding: 8px 24px; border-top: 1px solid var(--sue-color-split);"
      >
        <sue-space>
          <sue-button @click="open = false">
            Cancel
          </sue-button>
          <sue-button type="primary" @click="open = false">
            Submit
          </sue-button>
        </sue-space>
      </sue-flex>
    </sue-flex>
  </sue-drawer>
</template>
```
