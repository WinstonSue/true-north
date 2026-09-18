# Drag and Drop

## Description (en-US)

You can drag files to a specific area, to upload. Alternatively, you can also upload by selecting.

We can upload several files at once in modern browsers by giving the input the `multiple` attribute.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits } from '@sue/design-web-vue'
import { Inbox } from '@lucide/vue'
import { message } from '@sue/design-web-vue'

const handleChange: UploadEmits['change'] = (info) => {
  const { status } = info.file
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  }
  else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

const handleDrop: UploadEmits['drop'] = (event) => {
  console.log('Dropped files', event.dataTransfer?.files)
}
</script>

<template>
  <sue-upload-dragger
    name="file"
    multiple
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    @change="handleChange"
    @drop="handleDrop"
  >
    <p class="sue-upload-drag-icon">
      <Inbox />
    </p>
    <p class="sue-upload-text">
      Click or drag file to this area to upload
    </p>
    <p class="sue-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </sue-upload-dragger>
</template>
```
