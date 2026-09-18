# _semantic

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from '@sue/design-web-vue'
import { computed, onMounted, shallowRef } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const formRef = shallowRef<FormInstance>()

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
  { name: 'help', desc: t('help'), version: '1.3.0' },
  { name: 'helpItem', desc: t('helpItem'), version: '1.3.0' },
  { name: 'extra', desc: t('extra'), version: '1.3.0' },
])

onMounted(() => {
  formRef.value?.setFields?.([
    {
      name: 'password',
      errors: ['Please input your password!', 'Use at least 8 characters.'],
    },
  ])
})
</script>

<template>
  <SemanticPreview
    component-name="Form"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-form
        ref="formRef"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :style="{ maxWidth: '600px' }"
        :initial-values="{ remember: true }"
        autocomplete="off"
        :classes="classes"
      >
        <sue-form-item
          label="Username"
          name="username"
          help="Use 4 to 16 characters."
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <sue-input />
        </sue-form-item>
        <sue-form-item
          label="Password"
          name="password"
          extra="Password must contain letters and numbers."
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Use at least 8 characters.' },
          ]"
        >
          <sue-input-password />
        </sue-form-item>
      </sue-form>
    </template>
  </SemanticPreview>
</template>
```
