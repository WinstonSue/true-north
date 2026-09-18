# complex form control

## Description (en-US)

Combine multiple controls in one line.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  address: {
    province: undefined as string | undefined,
    street: '',
  },
  year: '',
  month: '',
})

const provinceOptions = [
  { label: 'Zhejiang', value: 'Zhejiang' },
  { label: 'Jiangsu', value: 'Jiangsu' },
]

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <sue-form
    name="complex-form"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <sue-form-item label="Username">
      <sue-space>
        <sue-form-item
          name="username"
          no-style
          :rules="[{ required: true, message: 'Username is required' }]"
        >
          <sue-input v-model:value="model.username" style="width: 160px" placeholder="Please input" />
        </sue-form-item>
        <sue-tooltip title="Useful information">
          <a href="#API">
            Need Help?
          </a>
        </sue-tooltip>
      </sue-space>
    </sue-form-item>

    <sue-form-item label="Address">
      <sue-space-compact block>
        <sue-form-item
          :name="['address', 'province']"
          no-style
          :rules="[{ required: true, message: 'Province is required' }]"
        >
          <sue-select v-model:value="model.address.province" placeholder="Select province" :options="provinceOptions" />
        </sue-form-item>
        <sue-form-item
          :name="['address', 'street']"
          no-style
          :rules="[{ required: true, message: 'Street is required' }]"
        >
          <sue-input v-model:value="model.address.street" style="width: 50%" placeholder="Input street" />
        </sue-form-item>
      </sue-space-compact>
    </sue-form-item>

    <sue-form-item label="BirthDate" style="margin-bottom: 0">
      <sue-form-item
        name="year"
        :rules="[{ required: true }]"
        style="display: inline-block; width: calc(50% - 8px)"
      >
        <sue-input v-model:value="model.year" placeholder="Input birth year" />
      </sue-form-item>
      <sue-form-item
        name="month"
        :rules="[{ required: true }]"
        style="display: inline-block; width: calc(50% - 8px); margin: 0 8px"
      >
        <sue-input v-model:value="model.month" placeholder="Input birth month" />
      </sue-form-item>
    </sue-form-item>

    <sue-form-item :label="null">
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
