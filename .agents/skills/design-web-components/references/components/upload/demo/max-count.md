# Max Count

## Description (en-US)

Limit files with `maxCount`. Will replace current one when `maxCount` is `1`.

## Source

```vue
<script setup lang="ts">
import { Upload } from '@lucide/vue'
</script>

<template>
  <sue-space direction="vertical" style="width: 100%" size="large">
    <sue-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      list-type="picture"
      :max-count="1"
    >
      <sue-button>
        <template #icon>
          <Upload />
        </template>
        Upload (Max: 1)
      </sue-button>
    </sue-upload>
    <sue-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      list-type="picture"
      :max-count="3"
      multiple
    >
      <sue-button>
        <template #icon>
          <Upload />
        </template>
        Upload (Max: 3)
      </sue-button>
    </sue-upload>
  </sue-space>
</template>
```
