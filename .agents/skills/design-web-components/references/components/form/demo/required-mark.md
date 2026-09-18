# Required style

## Description (en-US)

Display required mark styles.

## Source

```vue
<script setup lang="ts">
import type { FormProps } from '@sue/design-web-vue'
import { Info } from '@lucide/vue'
import { h, reactive } from 'vue'

const model = reactive({
  requiredMarkValue: 'optional',
  fieldA: '',
  fieldB: '',
})

const requiredMarkOptions = [
  { label: 'Default', value: true },
  { label: 'Optional', value: 'optional' },
  { label: 'Hidden', value: false },
  { label: 'Customize', value: 'customize' },
]

const customizeRequiredMark: NonNullable<FormProps['requiredMark']> = (labelNode, { required }) => {
  return h(
    'span',
    {},
    [
      h(
        'span',
        {
          style: {
            display: 'inline-block',
            marginRight: '8px',
            padding: '0 6px',
            borderRadius: '4px',
            color: required ? '#cf1322' : '#faad14',
            border: `1px solid ${required ? '#cf1322' : '#faad14'}`,
          },
        },
        required ? 'Required' : 'Optional',
      ),
      labelNode,
    ],
  )
}

function formRequiredMark(value: string | boolean) {
  return value === 'customize' ? customizeRequiredMark : value
}
</script>

<template>
  <sue-form
    layout="vertical"
    :model="model"
    :required-mark="formRequiredMark(model.requiredMarkValue as any)"
    style="max-width: 600px"
  >
    <sue-form-item label="Required Mark" name="requiredMarkValue">
      <sue-radio-group v-model:value="model.requiredMarkValue">
        <sue-radio-button v-for="item in requiredMarkOptions" :key="String(item.value)" :value="item.value">
          {{ item.label }}
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Field A" required tooltip="This is a required field">
      <sue-input v-model:value="model.fieldA" placeholder="input placeholder" />
    </sue-form-item>
    <sue-form-item
      label="Field B"
      :tooltip="{ title: 'Tooltip with customize icon', icon: Info }"
    >
      <sue-input v-model:value="model.fieldB" placeholder="input placeholder" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-button type="primary">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
