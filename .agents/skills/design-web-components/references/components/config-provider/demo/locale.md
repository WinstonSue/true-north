# Locale

## Description (en-US)

Components which need localization support are listed here, you can toggle the language in the demo.

## Source

```vue
<script setup lang="ts">
import type { ConfigProviderProps, TableProps, TourStepItem, UploadFile } from '@sue/design-web-vue'

import { Ellipsis } from '@lucide/vue'
import { Modal, theme } from '@sue/design-web-vue'
import enUS from '@sue/design-web-vue/locale/en_US'
import zhCN from '@sue/design-web-vue/locale/zh_CN'
import dayjs from 'dayjs'
import { reactive, ref, shallowRef, watch } from 'vue'
import 'dayjs/locale/zh-cn'

type Locale = ConfigProviderProps['locale']

dayjs.locale('en')

const { token } = theme.useToken()

const localeName = ref<'en-US' | 'zh-CN'>('en-US')

const locale = ref<Locale>(enUS)
const open = ref(false)
const tourOpen = ref(false)
const tourRef1 = shallowRef()
const tourRef2 = shallowRef()
const tourRef3 = shallowRef()

watch(localeName, (next) => {
  dayjs.locale(next === 'zh-CN' ? 'zh-cn' : 'en')
  locale.value = next === 'zh-CN' ? zhCN : enUS
})

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [{ text: 'filter1', value: 'filter1' }],
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
]

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: tourRef1,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: tourRef2,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: tourRef3,
  },
]

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image.png',
    status: 'error',
  },
])

const formState = reactive({
  username: '',
  age: 100,
})

const selectOptions = [
  { label: 'jack', value: 'jack' },
  { label: 'lucy', value: 'lucy' },
]

function showModal() {
  open.value = true
}

function hideModal() {
  open.value = false
}

function info() {
  Modal.info({
    title: 'some info',
    content: 'some info',
  })
}

function confirm() {
  Modal.confirm({
    title: 'some info',
    content: 'some info',
  })
}
</script>

<template>
  <div style="margin-bottom: 16px;">
    <span style="margin-inline-end: 16px;">Change locale of components:</span>
    <sue-radio-group v-model:value="localeName">
      <sue-radio-button value="en-US">
        English
      </sue-radio-button>
      <sue-radio-button value="zh-CN">
        中文
      </sue-radio-button>
    </sue-radio-group>
  </div>
  <sue-config-provider :locale="locale">
    <sue-space
      vertical
      :size="[0, 16]"
      :style="{
        width: '100%',
        paddingTop: '16px',
        borderTop: `1px solid ${token.colorBorder}`,
      }"
    >
      <sue-pagination :default-current="1" :total="50" show-size-changer />
      <sue-space wrap>
        <sue-select show-search style="width: 200px" :options="selectOptions" />
        <sue-date-picker />
        <sue-time-picker />
        <sue-range-picker />
      </sue-space>
      <sue-space wrap>
        <sue-button type="primary" @click="showModal">
          Show Modal
        </sue-button>
        <sue-button @click="info">
          Show info
        </sue-button>
        <sue-button @click="confirm">
          Show confirm
        </sue-button>
        <sue-popconfirm title="Question?">
          <a href="#">Click to confirm</a>
        </sue-popconfirm>
      </sue-space>
      <sue-transfer :data-source="[]" show-search :target-keys="[]" />
      <div :style="{ width: '320px', border: `1px solid ${token.colorBorder}`, borderRadius: '8px' }">
        <sue-calendar :fullscreen="false" :value="dayjs()" />
      </div>
      <sue-form
        :model="formState"
        auto-complete="off"
        :label-col="{ sm: { span: 4 } }"
        :wrapper-col="{ span: 6 }"
      >
        <sue-form-item label="Username" name="username" :rules="[{ required: true }]">
          <sue-input v-model:value="formState.username" :style="{ width: '200px' }" />
        </sue-form-item>
        <sue-form-item
          label="Age"
          name="age"
          :rules="[{ type: 'number', min: 0, max: 99 }]"
        >
          <sue-input-number v-model:value="formState.age" :style="{ width: '200px' }" />
        </sue-form-item>
        <sue-form-item :wrapper-col="{ offset: 2, span: 6 }">
          <sue-button type="primary" html-type="submit">
            Submit
          </sue-button>
        </sue-form-item>
      </sue-form>
      <sue-table :data-source="[]" :columns="columns" />
      <sue-modal v-model:open="open" title="Locale Modal" @cancel="hideModal">
        <p>Locale Modal</p>
      </sue-modal>
      <sue-space wrap :size="80">
        <sue-qrcode value="https://ant.design/" status="expired" @refresh="() => console.log('refresh')" />
        <sue-image
          :width="160"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </sue-space>
      <sue-upload v-model:file-list="fileList" list-type="picture-card">
        <div style="padding: 8px 0">
          Upload
        </div>
      </sue-upload>
      <sue-divider title-placement="start">
        Tour
      </sue-divider>
      <sue-button type="primary" @click="tourOpen = true">
        Begin Tour
      </sue-button>
      <sue-space>
        <sue-button ref="tourRef1">
          Upload
        </sue-button>
        <sue-button ref="tourRef2" type="primary">
          Save
        </sue-button>
        <sue-button ref="tourRef3">
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-space>
      <sue-tour v-model:open="tourOpen" :steps="steps" />
    </sue-space>
  </sue-config-provider>
</template>
```
