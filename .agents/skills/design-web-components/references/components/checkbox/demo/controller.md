# Controlled Checkbox

## Description (en-US)

Communicated with other components.

## Source

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const checked = shallowRef(true)
const disabled = shallowRef(false)

function toggleChecked() {
  checked.value = !checked.value
}

function toggleDisable() {
  disabled.value = !disabled.value
}

function onChange(e: any) {
  console.log('checked = ', e.target.checked)
  checked.value = e.target.checked
}

const label = computed(() => `${checked.value ? 'Checked' : 'Unchecked'}-${disabled.value ? 'Disabled' : 'Enabled'}`)
</script>

<template>
  <p style="margin-bottom: 20px">
    <sue-checkbox
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    >
      {{ label }}
    </sue-checkbox>
  </p>
  <p>
    <sue-button type="primary" size="small" @click="toggleChecked">
      {{ !checked ? 'Check' : 'Uncheck' }}
    </sue-button>
    <sue-button style="margin: 0 10px" type="primary" size="small" @click="toggleDisable">
      {{ !disabled ? 'Disable' : 'Enable' }}
    </sue-button>
  </p>
</template>
```
