# Checkable

## Description (en-US)

`CheckableTag` works like Checkbox, click it to toggle checked state. `CheckableTagGroup` provides function that is similar to `CheckboxGroup` or `RadioGroup`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tagsData = ['Movies', 'Books', 'Music', 'Sports']
const checked = ref(true)
const singleSelected = ref('Books')
const multipleSelected = ref<string[]>(['Movies', 'Music'])
</script>

<template>
  <sue-form :label-col="{ span: 6 }">
    <sue-form-item label="Checkable">
      <sue-checkable-tag :checked="checked" @change="checked = !checked">
        Yes
      </sue-checkable-tag>
    </sue-form-item>
    <sue-form-item label="Single">
      <sue-checkable-tag-group v-model:value="singleSelected" :checked="singleSelected" :options="tagsData" />
    </sue-form-item>
    <sue-form-item label="Multiple">
      <sue-checkable-tag-group v-model:value="multipleSelected" multiple :checked="multipleSelected" :options="tagsData" />
    </sue-form-item>
  </sue-form>
</template>
```
