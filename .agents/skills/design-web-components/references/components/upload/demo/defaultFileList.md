# Default Files

## Description (en-US)

Use `defaultFileList` for uploaded files when page init.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile } from '@sue/design-web-vue'
import { Upload } from '@lucide/vue'

const defaultFileList: UploadFile[] = [
  {
    uid: '1',
    name: 'xxx.png',
    status: 'uploading',
    url: 'http://www.baidu.com/xxx.png',
    percent: 33,
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    response: 'Server Error 500',
    url: 'http://www.baidu.com/zzz.png',
  },
]

const handleChange: UploadEmits['change'] = ({ file, fileList }) => {
  if (file?.status !== 'uploading') {
    console.log(file, fileList)
  }
}
</script>

<template>
  <sue-upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    :default-file-list="defaultFileList"
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
