# Use with Grid

## Description (en-US)

We can use Checkbox and Grid in CheckboxGroup, to implement complex layout.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([])

function onChange(checkedValues: any[]) {
  console.log('checked = ', checkedValues)
}
</script>

<template>
  <sue-checkbox-group v-model:value="value" style="width: 100%" @change="onChange">
    <sue-row>
      <sue-col :span="8">
        <sue-checkbox value="A">
          A
        </sue-checkbox>
      </sue-col>
      <sue-col :span="8">
        <sue-checkbox value="B">
          B
        </sue-checkbox>
      </sue-col>
      <sue-col :span="8">
        <sue-checkbox value="C">
          C
        </sue-checkbox>
      </sue-col>
      <sue-col :span="8">
        <sue-checkbox value="D">
          D
        </sue-checkbox>
      </sue-col>
      <sue-col :span="8">
        <sue-checkbox value="E">
          E
        </sue-checkbox>
      </sue-col>
    </sue-row>
  </sue-checkbox-group>
</template>
```
