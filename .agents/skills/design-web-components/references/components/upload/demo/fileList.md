# Complete control over file list

## Description (en-US)

You can gain full control over filelist by configuring `fileList`. You can accomplish all kinds of customized functions. The following shows two circumstances:

1. limit the number of uploaded files.

2. read from response and show file link.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile } from '@sue/design-web-vue'
import { Upload } from '@lucide/vue'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'http://www.baidu.com/xxx.png',
  },
])

const handleChange: UploadEmits['change'] = (info) => {
  let newFileList = [...info.fileList]

  newFileList = newFileList.slice(-2)

  newFileList = newFileList.map((file) => {
    if (file.response && typeof file.response === 'object' && 'url' in file.response) {
      file.url = (file.response as { url?: string }).url
    }
    return file
  })

  fileList.value = newFileList
}
</script>

<template>
  <sue-upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    multiple
    :file-list="fileList"
    @change="handleChange"
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
