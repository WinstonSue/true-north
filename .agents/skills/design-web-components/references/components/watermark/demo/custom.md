# Custom configuration

## Description (en-US)

Preview the watermark effect by configuring custom parameters.

## Source

```vue
<script setup lang="ts">
import type { ColorValueType, WatermarkProps } from '@sue/design-web-vue'
import { computed, reactive } from 'vue'

const formState = reactive({
  content: 'Antdv Next',
  color: 'rgba(0, 0, 0, 0.15)' as ColorValueType,
  fontSize: 16,
  zIndex: 11,
  rotate: -22,
  gapX: 100,
  gapY: 100,
  offsetX: null as number | null,
  offsetY: null as number | null,
})

const resolvedColor = computed(() => {
  const color = formState.color
  if (!color)
    return 'rgba(0, 0, 0, 0.15)'
  if (typeof color === 'string')
    return color
  if (!Array.isArray(color)) {
    return color.toRgbString()
  }
  return ''
})

const watermarkProps = computed<WatermarkProps>(() => ({
  content: formState.content,
  zIndex: formState.zIndex,
  rotate: formState.rotate,
  gap: [formState.gapX, formState.gapY],
  offset: formState.offsetX != null && formState.offsetY != null
    ? [formState.offsetX, formState.offsetY]
    : undefined,
  font: {
    color: resolvedColor.value,
    fontSize: formState.fontSize,
  },
}))
</script>

<template>
  <sue-flex gap="middle">
    <sue-watermark v-bind="watermarkProps">
      <div>
        <sue-editable-paragraph>
          The light-speed iteration of the digital world makes products more complex. However,
          human consciousness and attention resources are limited. Facing this design
          contradiction, the pursuit of natural interaction will be the consistent direction of
          Ant Design.
        </sue-editable-paragraph>
        <sue-editable-paragraph>
          Natural user cognition: According to cognitive psychology, about 80% of external
          information is obtained through visual channels. The most important visual elements in
          the interface design, including layout, colors, illustrations, icons, etc., should fully
          absorb the laws of nature, thereby reducing the user&apos;s cognitive cost and bringing
          authentic and smooth feelings. In some scenarios, opportunely adding other sensory
          channels such as hearing, touch can create a richer and more natural product experience.
        </sue-editable-paragraph>
        <sue-editable-paragraph>
          Natural user behavior: In the interaction with the system, the designer should fully
          understand the relationship between users, system roles, and task objectives, and also
          contextually organize system functions and services. At the same time, a series of
          methods such as behavior analysis, artificial intelligence and sensors could be applied
          to assist users to make effective decisions and reduce extra operations of users, to
          save users&apos; mental and physical resources and make human-computer interaction more
          natural.
        </sue-editable-paragraph>
      </div>
      <img
        draggable="false"
        style="z-index: 10; width: 100%; max-width: 800px; position: relative;"
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
        alt="img"
      >
    </sue-watermark>
    <sue-form :model="formState" layout="vertical" style="width: 200px; flex-shrink: 0; border-inline-start: 1px solid #eee; padding-inline-start: 16px;">
      <sue-form-item label="Content">
        <sue-input v-model:value="formState.content" placeholder="请输入" />
      </sue-form-item>
      <sue-form-item label="Color">
        <sue-color-picker v-model:value="formState.color as any" />
      </sue-form-item>
      <sue-form-item label="FontSize">
        <sue-slider v-model:value="formState.fontSize" :step="1" :min="1" :max="100" />
      </sue-form-item>
      <sue-form-item label="zIndex">
        <sue-slider v-model:value="formState.zIndex" :step="1" :min="0" :max="100" />
      </sue-form-item>
      <sue-form-item label="Rotate">
        <sue-slider v-model:value="formState.rotate" :step="1" :min="-180" :max="180" />
      </sue-form-item>
      <sue-form-item label="Gap" :style="{ marginBottom: 0 }">
        <sue-flex gap="small">
          <sue-form-item style="flex: 1">
            <sue-input-number v-model:value="formState.gapX" placeholder="gapX" style="width: 100%" />
          </sue-form-item>
          <sue-form-item style="flex: 1">
            <sue-input-number v-model:value="formState.gapY" placeholder="gapY" style="width: 100%" />
          </sue-form-item>
        </sue-flex>
      </sue-form-item>
      <sue-form-item label="Offset" :style="{ marginBottom: 0 }">
        <sue-flex gap="small">
          <sue-form-item style="flex: 1">
            <sue-input-number v-model:value="formState.offsetX" placeholder="offsetLeft" style="width: 100%" />
          </sue-form-item>
          <sue-form-item style="flex: 1">
            <sue-input-number v-model:value="formState.offsetY" placeholder="offsetTop" style="width: 100%" />
          </sue-form-item>
        </sue-flex>
      </sue-form-item>
    </sue-form>
  </sue-flex>
</template>
```
