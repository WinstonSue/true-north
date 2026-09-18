# Form mix layout

## Description (en-US)

Mix horizontal and vertical layouts in one page.

## Source

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const modelHorizontal = reactive({
  horizontal: '',
  vertical: '',
  vertical2: '',
})

const modelVertical = reactive({
  horizontal: '',
  vertical: '',
  vertical2: '',
})
</script>

<template>
  <sue-form name="layout-multiple-horizontal" layout="horizontal" :model="modelHorizontal">
    <sue-form-item
      label="horizontal"
      name="horizontal"
      :rules="[{ required: true }]"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <sue-input v-model:value="modelHorizontal.horizontal" />
    </sue-form-item>
    <sue-form-item layout="vertical" label="vertical" name="vertical" :rules="[{ required: true }]">
      <sue-input v-model:value="modelHorizontal.vertical" />
    </sue-form-item>
    <sue-form-item layout="vertical" label="vertical2" name="vertical2" :rules="[{ required: true }]">
      <sue-input v-model:value="modelHorizontal.vertical2" />
    </sue-form-item>
  </sue-form>

  <sue-divider />

  <sue-form name="layout-multiple-vertical" layout="vertical" :model="modelVertical">
    <sue-form-item label="vertical" name="vertical" :rules="[{ required: true }]">
      <sue-input v-model:value="modelVertical.vertical" />
    </sue-form-item>
    <sue-form-item label="vertical2" name="vertical2" :rules="[{ required: true }]">
      <sue-input v-model:value="modelVertical.vertical2" />
    </sue-form-item>
    <sue-form-item
      layout="horizontal"
      label="horizontal"
      name="horizontal"
      :rules="[{ required: true }]"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <sue-input v-model:value="modelVertical.horizontal" />
    </sue-form-item>
  </sue-form>
</template>
```
