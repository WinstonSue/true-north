# Customized Validation

## Description (en-US)

Custom validation status display.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
</script>

<template>
  <sue-form
    :label-col="{ xs: { span: 24 }, sm: { span: 6 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 14 } }"
    style="max-width: 600px"
  >
    <sue-form-item
      label="Fail"
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <sue-input placeholder="unavailable choice" />
    </sue-form-item>

    <sue-form-item label="Warning" validate-status="warning">
      <sue-input placeholder="Warning">
        <template #prefix>
          <Smile />
        </template>
      </sue-input>
    </sue-form-item>

    <sue-form-item
      label="Validating"
      has-feedback
      validate-status="validating"
      help="The information is being validated..."
    >
      <sue-input placeholder="I'm the content is being validated" />
    </sue-form-item>

    <sue-form-item label="Success" has-feedback validate-status="success">
      <sue-input placeholder="I'm the content" />
    </sue-form-item>

    <sue-form-item label="Error" has-feedback validate-status="error">
      <sue-date-picker style="width: 100%" />
    </sue-form-item>

    <sue-form-item label="Warning" has-feedback validate-status="warning">
      <sue-select
        placeholder="I'm Select"
        :options="[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]"
      />
    </sue-form-item>

    <sue-form-item label="Success" has-feedback validate-status="success">
      <sue-input-number style="width: 100%" />
    </sue-form-item>

    <sue-form-item label="Fail" validate-status="error" has-feedback>
      <sue-textarea allow-clear show-count />
    </sue-form-item>
  </sue-form>
</template>
```
