# nested

## Description (en-US)

Nested in the modal.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)

function handlePreviewGroupChange(current: number, prev: number) {
  console.log(`current index: ${current}, prev index: ${prev}`)
}
</script>

<template>
  <sue-button @click="show1 = true">
    showModal
  </sue-button>
  <sue-modal
    v-model:open="show1"
    @cancel="show1 = false"
    @ok="show1 = false"
  >
    <sue-button @click="show2 = true">
      test2
    </sue-button>
    <sue-modal
      v-model:open="show2"
      @cancel="show2 = false"
      @ok="show2 = false"
    >
      <sue-button @click="show3 = true">
        test3
      </sue-button>
      <sue-modal
        v-model:open="show3"
        @cancel="show3 = false"
        @ok="show3 = false"
      >
        <sue-image
          :width="200"
          alt="svg image"
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <sue-divider />
        <sue-image-preview-group
          :preview="{
            onChange: handlePreviewGroupChange,
          }"
        >
          <sue-image
            :width="200"
            alt="svg image"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <sue-image
            :width="200"
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </sue-image-preview-group>
      </sue-modal>
    </sue-modal>
  </sue-modal>
</template>
```
