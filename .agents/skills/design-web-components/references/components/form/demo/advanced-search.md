# Advanced search

## Description (en-US)

Advanced search form with expand/collapse.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { ChevronDown } from '@lucide/vue'
import { computed, reactive, ref, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const expand = ref(false)
const model = reactive<Record<string, string>>({})

const fieldCount = computed(() => (expand.value ? 10 : 6))

const selectOptions = [
  {
    value: '1',
    label: 'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
  },
  {
    value: '2',
    label: '222',
  },
]

function handleFinish(values: any) {
  console.log('Received values of form:', values)
}

function handleReset() {
  formRef.value?.resetFields?.()
}
</script>

<template>
  <sue-form
    ref="formRef"
    name="advanced_search"
    :model="model"
    style="max-width: none; background: #fafafa; border-radius: 8px; padding: 24px"
    @finish="handleFinish"
  >
    <sue-row :gutter="24">
      <sue-col v-for="i in fieldCount" :key="i" :span="8">
        <sue-form-item
          v-if="i % 3 !== 1"
          :name="`field-${i - 1}`"
          :label="`Field ${i - 1}`"
          :rules="[{ required: true, message: 'Input something!' }]"
        >
          <sue-input v-model:value="model[`field-${i - 1}`]" placeholder="placeholder" />
        </sue-form-item>
        <sue-form-item
          v-else
          :name="`field-${i - 1}`"
          :label="`Field ${i - 1}`"
          :rules="[{ required: true, message: 'Select something!' }]"
        >
          <sue-select
            v-model:value="model[`field-${i - 1}`]"
            :options="selectOptions"
            placeholder="Select"
          />
        </sue-form-item>
      </sue-col>
    </sue-row>

    <div style="text-align: end">
      <sue-space size="small">
        <sue-button type="primary" html-type="submit">
          Search
        </sue-button>
        <sue-button html-type="button" @click="handleReset">
          Clear
        </sue-button>
        <sue-button type="link" size="small" @click="expand = !expand">
          <ChevronDown :style="{ transform: expand ? 'rotate(180deg)' : undefined }" />
          {{ expand ? 'Collapse' : 'Expand' }}
        </sue-button>
      </sue-space>
    </div>
  </sue-form>

  <div style="line-height: 200px; text-align: center; background: #fafafa; border-radius: 8px; margin-top: 16px">
    Search Result List
  </div>
</template>
```
