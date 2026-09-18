# Password box

## Description (en-US)

Input type of password.

## Source

```vue
<script setup lang="ts">
import { EyeOff, Eye } from '@lucide/vue'
import { ref } from 'vue'

const passwordVisible = ref(false)
</script>

<template>
  <sue-space direction="vertical">
    <sue-input-password placeholder="input password" />
    <sue-input-password placeholder="input password">
      <template #iconRender="{ visible }">
        <Eye v-if="visible" />
        <EyeOff v-else />
      </template>
    </sue-input-password>
    <sue-space>
      <sue-input-password
        placeholder="input password"
        :visibility-toggle="{ visible: passwordVisible, onVisibleChange: (v: boolean) => passwordVisible = v }"
      />
      <sue-button style="width: 80px;" @click="passwordVisible = !passwordVisible">
        {{ passwordVisible ? 'Hide' : 'Show' }}
      </sue-button>
    </sue-space>
    <sue-input-password disabled placeholder="disabled input password" />
  </sue-space>
</template>
```
