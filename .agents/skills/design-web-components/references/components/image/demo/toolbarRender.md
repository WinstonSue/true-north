# Custom toolbar render

## Description (en-US)

You can customize the toolbar and add a button for downloading the original image or downloading the flipped and rotated image.

## Source

```vue
<script setup lang="ts">
import { Download, ChevronLeft, ChevronRight, RotateCcw, RotateCw, ArrowLeftRight, Undo2, ZoomIn, ZoomOut } from '@lucide/vue'
import { ref } from 'vue'

const imageList = [
  'https://www.@sue/design-web-vue.com/@sue/design-web-vue.svg',
  'https://cn.vuejs.org/logo.svg',
]
const current = ref(0)
function handlePreviewChange(val: number) {
  console.log('current', current.value, val)
  current.value = val
}
function onDownload() {
  const url = imageList[current.value]
  const suffix = url!.slice(url!.lastIndexOf('.'))
  const filename = Date.now() + suffix

  fetch(url!)
    .then(response => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(blobUrl)
      link.remove()
    })
}
</script>

<template>
  <sue-image-preview-group
    :preview="{
      onChange: handlePreviewChange,
    }"
  >
    <template v-for="(item, index) in imageList" :key="index">
      <sue-image :alt="`image-${index}`" :src="item" :width="200" />
    </template>
    <template #actionsRender="_, { transform, actions }">
      <sue-space :size="12" class="toolbar-wrapper">
        <ChevronLeft :disabled="current === 0" @click="actions.onActive(-1)" />
        <ChevronRight :disabled="current === imageList.length - 1" @click="actions.onActive(1)" />
        <Download @click="onDownload" />
        <ArrowLeftRight :rotate="90" @click="actions.onFlipX" />
        <ArrowLeftRight @click="actions.onFlipY" />
        <RotateCcw @click="actions.onRotateLeft" />
        <RotateCw @click="actions.onRotateRight" />
        <ZoomOut :disabled="transform.scale === 1" @click="actions.onZoomOut" />
        <ZoomIn :disabled="transform.scale === 50" @click="actions.onZoomIn" />
        <Undo2 @click="actions.onReset" />
      </sue-space>
    </template>
  </sue-image-preview-group>
</template>

<style scoped>
  .toolbar-wrapper {
  padding: 0px 24px;
  color: #fff;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 100px;
}

.toolbar-wrapper .sueicon {
  padding: 12px;
  cursor: pointer;
}

.toolbar-wrapper .sueicon[disabled='true'] {
  cursor: not-allowed;
  opacity: 0.3;
}

.toolbar-wrapper .sueicon:hover {
  opacity: 0.3;
}
</style>
```
