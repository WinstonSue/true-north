# Progressive Loading

## Description (en-US)

Progressive when large image loading.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const random = shallowRef(Date.now())

function setRandom() {
  random.value = Date.now()
}
</script>

<template>
  <sue-space :size="12">
    <sue-image :width="200" alt="basic image" :src="`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`">
      <template #placeholder>
        <sue-image
          :preview="false"
          alt="placeholder image"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
          :width="200"
        />
      </template>
    </sue-image>
    <sue-button
      type="primary"
      @click="setRandom"
    >
      Reload
    </sue-button>
  </sue-space>
</template>
```
