# Form Layout

## Description (en-US)

Switch between horizontal, vertical, and inline layouts.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  layout: 'horizontal',
  fieldA: '',
  fieldB: '',
})
</script>

<template>
  <sue-form
    :model="model"
    :layout="model.layout as any"
    :style="{ maxWidth: model.layout === 'inline' ? 'none' : '600px' }"
  >
    <sue-form-item label="Form Layout" name="layout">
      <sue-radio-group v-model:value="model.layout">
        <sue-radio-button value="horizontal">
          Horizontal
        </sue-radio-button>
        <sue-radio-button value="vertical">
          Vertical
        </sue-radio-button>
        <sue-radio-button value="inline">
          Inline
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Field A" name="fieldA">
      <sue-input v-model:value="model.fieldA" placeholder="input placeholder" />
    </sue-form-item>
    <sue-form-item label="Field B" name="fieldB">
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
