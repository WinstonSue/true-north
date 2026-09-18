# Pictures with list style

## Description (en-US)

If uploaded file is a picture, the thumbnail can be shown. `IE8/9` do not support local thumbnail show. Please use `thumbUrl` instead.

## Source

```vue
<script setup lang="ts">
import type { UploadFile } from '@sue/design-web-vue'
import { Upload } from '@lucide/vue'

const defaultFileList: UploadFile[] = [
  {
    uid: '0',
    name: 'xxx.png',
    status: 'uploading',
    percent: 33,
  },
  {
    uid: '-1',
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'zzz.png',
    status: 'error',
  },
]
</script>

<template>
  <sue-upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    list-type="picture"
    :default-file-list="defaultFileList"
  >
    <sue-button type="primary">
      <template #icon>
        <Upload />
      </template>
      Upload
    </sue-button>
  </sue-upload>
</template>
```
