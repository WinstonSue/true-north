# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { ModalProps } from '@sue/design-web-vue'
import { computed, ref } from 'vue'

const modalOpen = ref(false)
const modalFnOpen = ref(false)

const lineStyle = {
  lineHeight: '28px',
}

const classNames = computed(() => ({
  container: 'custom-modal-container',
}))

const styles: ModalProps['styles'] = {
  mask: {
    backgroundImage: `linear-gradient(to top, #18181b 0, rgba(21, 21, 22, 0.2) 100%)`,
  },
}

const stylesFn: ModalProps['styles'] = {
  container: {
    borderRadius: '14px',
    border: '1px solid #ccc',
    padding: '0',
    overflow: 'hidden',
  },
  header: {
    padding: '16px',
  },
  body: {
    padding: '16px',
  },
}

const sharedProps = computed<ModalProps>(() => ({
  centered: true,
  classes: classNames.value,
}))
</script>

<template>
  <sue-flex gap="middle">
    <sue-button @click="modalOpen = true">
      Open Style Modal
    </sue-button>
    <sue-button type="primary" @click="modalFnOpen = true">
      Open Function Modal
    </sue-button>

    <sue-modal
      v-bind="sharedProps"
      v-model:open="modalOpen"
      title="Custom Style Modal"
      :styles="styles"
    >
      <div :style="lineStyle">
        Following the Ant Design specification, we developed a React UI library antd that contains a
        set of high quality components and demos for building rich, interactive user interfaces.
      </div>
      <div :style="lineStyle">
        🌈 Enterprise-class UI designed for web applications.
      </div>
      <div :style="lineStyle">
        📦 A set of high-quality React components out of the box.
      </div>
      <div :style="lineStyle">
        🛡 Written in TypeScript with predictable static types.
      </div>
      <div :style="lineStyle">
        ⚙️ Whole package of design resources and development tools.
      </div>
      <div :style="lineStyle">
        🌍 Internationalization support for dozens of languages.
      </div>
      <div :style="lineStyle">
        🎨 Powerful theme customization in every detail.
      </div>
    </sue-modal>

    <sue-modal
      v-bind="sharedProps"
      v-model:open="modalFnOpen"
      title="Custom Function Modal"
      :styles="stylesFn"
      :mask="{ enabled: true, blur: true }"
    >
      <div :style="lineStyle">
        Following the Ant Design specification, we developed a React UI library antd that contains a
        set of high quality components and demos for building rich, interactive user interfaces.
      </div>
      <div :style="lineStyle">
        🌈 Enterprise-class UI designed for web applications.
      </div>
      <div :style="lineStyle">
        📦 A set of high-quality React components out of the box.
      </div>
      <div :style="lineStyle">
        🛡 Written in TypeScript with predictable static types.
      </div>
      <div :style="lineStyle">
        ⚙️ Whole package of design resources and development tools.
      </div>
      <div :style="lineStyle">
        🌍 Internationalization support for dozens of languages.
      </div>
      <div :style="lineStyle">
        🎨 Powerful theme customization in every detail.
      </div>
    </sue-modal>
  </sue-flex>
</template>

<style scoped>
.custom-modal-container {
  border-radius: 10px;
  padding: 10px;
}
</style>
```
