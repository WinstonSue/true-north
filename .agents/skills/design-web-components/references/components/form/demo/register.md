# Registration

## Description (en-US)

Registration form example.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { computed, reactive, ref, shallowRef, watch } from 'vue'

const formRef = shallowRef<FormInstance>()

const model = reactive({
  email: '',
  password: '',
  confirm: '',
  nickname: '',
  residence: ['zhejiang', 'hangzhou', 'xihu'],
  phone: '',
  prefix: '86',
  amount: '',
  currency: 'USD',
  website: '',
  intro: '',
  gender: 'male',
  agreement: false,
})

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const prefixOptions = [
  { label: '+86', value: '86' },
  { label: '+87', value: '87' },
]

const donationOptions = [
  { label: '$', value: 'USD' },
  { label: '¥', value: 'CNY' },
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const autoCompleteResult = ref<string[]>([])

function onWebsiteChange(value: string) {
  autoCompleteResult.value = value
    ? ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    : []
}

const websiteOptions = computed(() =>
  autoCompleteResult.value.map(website => ({ value: website })),
)

watch(
  () => model.password,
  () => {
    if (model.confirm) {
      formRef.value?.validateFields?.(['confirm'])
    }
  },
)

const confirmRules = [
  { required: true, message: 'Please confirm your password!' },
  {
    validator: async (_rule: any, value: string) => {
      if (!value || value === model.password) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('The new password that you entered do not match!'))
    },
  },
]

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <sue-form
    ref="formRef"
    name="register"
    :model="model"
    :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
    style="max-width: 600px"
    scroll-to-first-error
    @finish="handleFinish"
  >
    <sue-form-item
      name="email"
      label="E-mail"
      :rules="[
        { type: 'email', message: 'The input is not valid E-mail!' },
        { required: true, message: 'Please input your E-mail!' },
      ]"
    >
      <sue-input v-model:value="model.email" />
    </sue-form-item>

    <sue-form-item
      name="password"
      label="Password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
      has-feedback
    >
      <sue-input-password v-model:value="model.password" />
    </sue-form-item>

    <sue-form-item name="confirm" label="Confirm Password" :rules="confirmRules" has-feedback>
      <sue-input-password v-model:value="model.confirm" />
    </sue-form-item>

    <sue-form-item
      name="nickname"
      label="Nickname"
      tooltip="What do you want others to call you?"
      :rules="[{ required: true, message: 'Please input your nickname!' }]"
    >
      <sue-input v-model:value="model.nickname" />
    </sue-form-item>

    <sue-form-item
      name="residence"
      label="Habitual Residence"
      :rules="[{ required: true, message: 'Please select your habitual residence!' }]"
    >
      <sue-cascader v-model:value="model.residence" :options="residences" />
    </sue-form-item>

    <sue-form-item name="phone" label="Phone Number" :rules="[{ required: true, message: 'Please input your phone number!' }]">
      <sue-space-compact block>
        <sue-select v-model:value="model.prefix" style="width: 70px" :options="prefixOptions" />
        <sue-input v-model:value="model.phone" style="width: 100%" />
      </sue-space-compact>
    </sue-form-item>

    <sue-form-item name="donation" label="Donation" :rules="[{ required: true, message: 'Please input donation amount!' }]">
      <sue-space-compact block>
        <sue-input-number v-model:value="model.amount" style="width: 100%" />
        <sue-select v-model:value="model.currency" style="width: 70px" :options="donationOptions" />
      </sue-space-compact>
    </sue-form-item>

    <sue-form-item name="website" label="Website" :rules="[{ required: true, message: 'Please input website!' }]">
      <sue-auto-complete
        v-model:value="model.website"
        placeholder="website"
        :options="websiteOptions"
        @change="onWebsiteChange"
      />
    </sue-form-item>

    <sue-form-item
      name="intro"
      label="Intro"
      :rules="[{ required: true, message: 'Please input Intro' }]"
    >
      <sue-textarea show-count :max-length="100" />
    </sue-form-item>

    <sue-form-item name="gender" :required="true" label="Gender" :rules="[{ required: true, message: 'Please select your gender' }]">
      <sue-select v-model:value="model.gender" placeholder="Please select gender!" :options="genderOptions" />
    </sue-form-item>

    <sue-form-item label="Captcha" extra="We must make sure that your are a human.">
      <sue-row :gutter="8">
        <sue-col :span="12">
          <sue-form-item
            name="captcha"
            no-style
            :rules="[{ required: true, message: 'Please input the captcha you got!' }]"
          >
            <sue-input />
          </sue-form-item>
        </sue-col>
        <sue-col :span="12">
          <sue-button>Get captcha</sue-button>
        </sue-col>
      </sue-row>
    </sue-form-item>

    <sue-form-item name="agreement" :wrapper-col="{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }">
      <sue-checkbox v-model:checked="model.agreement">
        I have read the <a href="">agreement</a>
      </sue-checkbox>
    </sue-form-item>

    <sue-form-item :wrapper-col="{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }">
      <sue-button type="primary" html-type="submit">
        Register
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
