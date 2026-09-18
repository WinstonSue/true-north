# Customize preview file

## Description (en-US)

Customize local preview. Can handle with non-image format files such as video.

## Source

```vue
<script setup lang="ts">
import type { UploadProps } from '@sue/design-web-vue'
import { Upload } from '@lucide/vue'

const previewFile: UploadProps['previewFile'] = (file) => {
  console.log('Your upload file:', file)
  return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
    method: 'POST',
    body: file as BodyInit,
  })
    .then(res => res.json())
    .then(({ thumbnail }) => thumbnail)
}
</script>

<template>
  <sue-upload
    action="//jsonplaceholder.typicode.com/posts/"
    list-type="picture"
    :preview-file="previewFile"
  >
    <sue-button>
      <template #icon>
        <Upload />
      </template>
      Upload
    </sue-button>
  </sue-upload>
</template>
```
