# label can wrap

## Description (en-US)

Allow label text to wrap.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
  password1: '',
})
</script>

<template>
  <sue-form
    name="wrap"
    :model="model"
    :label-col="{ flex: '110px' }"
    label-align="left"
    label-wrap
    :wrapper-col="{ flex: 1 }"
    :colon="false"
    style="max-width: 600px"
  >
    <sue-form-item label="Normal label" name="username" :rules="[{ required: true }]">
      <sue-input v-model:value="model.username" />
    </sue-form-item>

    <sue-form-item label="A super long label text" name="password" :rules="[{ required: true }]">
      <sue-input v-model:value="model.password" />
    </sue-form-item>

    <sue-form-item label="A super long label text" name="password1">
      <sue-input v-model:value="model.password1" />
    </sue-form-item>

    <sue-form-item label=" ">
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
