# Component Token

## Description (en-US)

Custom component token.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import { h } from 'vue'

const icon = () => h(Smile)
</script>

<template>
  <sue-config-provider
    :theme="{
      components: {
        Alert: {
          withDescriptionIconSize: 32,
          withDescriptionPadding: 16,
        },
      },
    }"
  >
    <sue-alert
      :icon="icon"
      title="Success Tips"
      description="Detailed description and advice about successful copywriting."
      type="success"
      show-icon
    />
  </sue-config-provider>
</template>
```
