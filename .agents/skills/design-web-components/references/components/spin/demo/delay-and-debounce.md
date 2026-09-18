# Delay

## Description (en-US)

Specifies a delay for loading state. If `spinning` ends during delay, loading status won't appear.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <sue-flex gap="middle" vertical>
    <sue-spin :spinning="loading" :delay="500">
      <sue-alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </sue-spin>
    <sue-flex align="center" gap="small">
      <span>Loading state:</span>
      <sue-switch v-model:checked="loading" />
    </sue-flex>
  </sue-flex>
</template>
```
