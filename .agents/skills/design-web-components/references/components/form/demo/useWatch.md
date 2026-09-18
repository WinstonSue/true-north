# Watch Hooks

## Description (en-US)

Watch form values with Vue reactivity.

## Source

```vue
<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

const model = reactive({
  username: 'Antdv Next',
  age: 18,
})

const watched = computed(() => ({
  username: model.username,
  age: model.age,
}))

watch(
  () => ({ ...model }),
  (val) => {
    console.log('form values changed:', val)
  },
)
</script>

<template>
  <sue-form layout="vertical" :model="model" style="max-width: 600px">
    <sue-form-item name="username" label="Username">
      <sue-input v-model:value="model.username" />
    </sue-form-item>
    <sue-form-item name="age" label="Age">
      <sue-input-number v-model:value="model.age" style="width: 100%" />
    </sue-form-item>
    <sue-form-item label="Watched Values">
      <pre style="margin: 0">{{ JSON.stringify(watched, null, 2) }}</pre>
    </sue-form-item>
  </sue-form>
</template>
```
