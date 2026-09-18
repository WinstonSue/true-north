# getValueProps + normalize

## Description (en-US)

Transform values with computed getters/setters.

## Source

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { computed, reactive } from 'vue'

const dateTimestamp = dayjs('2024-01-01').valueOf()

const model = reactive({
  date: String(dateTimestamp),
})

const dateValue = computed<Dayjs | null>({
  get: () => (model.date ? dayjs(Number(model.date)) : null),
  set: (val) => {
    model.date = val ? String(val.valueOf()) : ''
  },
})

function handleFinish(values: any) {
  console.log('Success:', values)
}
</script>

<template>
  <sue-form
    name="getValueProps"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <sue-form-item label="Date" name="date" :rules="[{ required: true }]">
      <sue-date-picker v-model:value="dateValue" style="width: 100%" />
    </sue-form-item>

    <sue-form-item :label="null">
      <sue-button type="primary" html-type="submit">
        Submit
      </sue-button>
    </sue-form-item>
  </sue-form>
</template>
```
