# Custom semantic dom styling

## Description (en-US)

You can customize the [semantic dom](#semantic-upload) style of Upload components by passing objects/functions through `classes` and `styles`.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from '@sue/design-web-vue'
import { Upload } from '@lucide/vue'

const classes: UploadProps['classes'] = {
  root: 'upload-demo-root',
}

const stylesObject: UploadProps['styles'] = {
  item: {
    borderRadius: 2,
    backgroundColor: 'rgba(5, 5, 5, 0.06)',
    height: '30px',
  },
}

const stylesFn: UploadProps['styles'] = (info) => {
  if (info.props.multiple) {
    return {
      root: { border: '1px solid #5459AC' },
      item: {
        borderRadius: 2,
        backgroundColor: 'rgba(5, 5, 5, 0.06)',
        height: '30px',
      },
    }
  }
  return {}
}

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
  <sue-flex gap="large" vertical>
    <sue-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :classes="classes"
      :default-file-list="defaultFileList"
      :styles="stylesObject"
      @change="handleChange"
    >
      <sue-button>
        <template #icon>
          <Upload />
        </template>
        Upload
      </sue-button>
    </sue-upload>
    <sue-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :classes="classes"
      :default-file-list="defaultFileList"
      :styles="stylesFn"
      multiple
      @change="handleChange"
    >
      <sue-button>
        <template #icon>
          <Upload />
        </template>
        Upload
      </sue-button>
    </sue-upload>
  </sue-flex>
</template>

<style>
.upload-demo-root {
  border-radius: 6px;
  padding: 12px;
}
</style>
```
