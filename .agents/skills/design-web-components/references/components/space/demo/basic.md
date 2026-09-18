# Basic Usage

## Description (en-US)

Horizontal spacing between adjacent components.

## Source

```vue
<script setup lang="ts">
import { Upload } from '@lucide/vue'
</script>

<template>
  <sue-space>
    Space
    <sue-button type="primary">
      Button
    </sue-button>
    <sue-upload>
      <sue-button>
        <template #icon>
          <Upload />
        </template>
        Click to Upload
      </sue-button>
    </sue-upload>

    <sue-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <sue-button>
        Confirm
      </sue-button>
    </sue-popconfirm>
  </sue-space>
</template>
```
