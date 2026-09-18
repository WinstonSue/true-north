# Upload directory

## Description (en-US)

You can select and upload a whole directory. [Can still select files when uploading a folder in Safari?](#can-still-select-files-when-uploading-sue-folder-in-safari)

## Source

```vue
<script setup lang="ts">
import { Upload } from '@lucide/vue'
</script>

<template>
  <sue-upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" directory>
    <sue-button>
      <template #icon>
        <Upload />
      </template>
      Upload Directory
    </sue-button>
  </sue-upload>
</template>
```
