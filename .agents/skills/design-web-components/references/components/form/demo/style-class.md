# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { FormProps } from '@sue/design-web-vue'
import { reactive } from 'vue'

const classes = {
  root: 'form-demo-root',
}

const stylesObject: FormProps['styles'] = {
  label: {
    textAlign: 'end',
    color: '#333',
    fontWeight: 500,
  },
  content: {
    paddingInlineStart: '12px',
  },
}

const stylesFunction: FormProps['styles'] = (info) => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #1677FF',
      },
      label: {
        textAlign: 'end',
        color: '#1677FF',
      },
      content: {
        paddingInlineStart: '12px',
      },
    } satisfies FormProps['styles']
  }
  return {}
}

const model = reactive({
  username: '',
  email: '',
})

const sharedProps: FormProps = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  autoComplete: 'off',
  classes,
}
</script>

<template>
  <sue-form
    :model="model"
    v-bind="sharedProps"
    :styles="stylesObject"
  >
    <sue-form-item label="UserName" name="username" :rules="[{ required: true, message: 'Please enter username!' }]">
      <sue-input v-model:value="model.username" placeholder="Please enter username" />
    </sue-form-item>
    <sue-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please enter email!' }]">
      <sue-input v-model:value="model.email" placeholder="Please enter email" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-space>
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button html-type="reset">
          Reset
        </sue-button>
      </sue-space>
    </sue-form-item>
  </sue-form>
  <sue-form
    :model="model"
    v-bind="sharedProps"
    :styles="stylesFunction"
    variant="filled"
  >
    <sue-form-item label="UserName" name="username" :rules="[{ required: true, message: 'Please enter username!' }]">
      <sue-input v-model:value="model.username" placeholder="Please enter username" />
    </sue-form-item>
    <sue-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please enter email!' }]">
      <sue-input v-model:value="model.email" placeholder="Please enter email" />
    </sue-form-item>
    <sue-form-item :label="null">
      <sue-space>
        <sue-button type="primary" html-type="submit">
          Submit
        </sue-button>
        <sue-button html-type="reset">
          Reset
        </sue-button>
      </sue-space>
    </sue-form-item>
  </sue-form>
</template>

<style scoped>
.form-demo-root {
  padding: var(--sue-padding);
  max-width: 800px;
  margin-top: 32px;
  background-color: var(--sue-color-bg-container);
  border-radius: var(--sue-border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```
