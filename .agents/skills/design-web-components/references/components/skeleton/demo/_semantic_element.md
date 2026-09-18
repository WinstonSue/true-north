# _semantic_element

## Source

```vue
<script setup lang="ts">
import type { SegmentedOptions } from '@sue/design-web-vue'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

type SkeletonElement = 'Avatar' | 'Button' | 'Input' | 'Image' | 'Node'
const internalOptions: SegmentedOptions = ['Avatar', 'Button', 'Input', 'Image', 'Node']

const element = ref<SkeletonElement>('Avatar')

const componentMap: Record<SkeletonElement, string> = {
  Avatar: 'sue-skeleton-avatar',
  Button: 'sue-skeleton-button',
  Input: 'sue-skeleton-input',
  Image: 'sue-skeleton-image',
  Node: 'sue-skeleton-node',
}

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('element.root'), version: '1.0.0' },
  { name: 'content', desc: t('element.content'), version: '1.0.0' },
])

const componentName = computed(() => `Skeleton.${element.value}`)
const currentComponent = computed(() => componentMap[element.value])
</script>

<template>
  <SemanticPreview
    :component-name="componentName"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-flex vertical :style="{ width: 'fit-content', marginInlineEnd: 'auto' }">
        <sue-segmented v-model:value="element" :options="internalOptions" />
        <sue-divider title-placement="start" plain>
          {{ t('element.preview') }}
        </sue-divider>
        <component :is="currentComponent" :classes="classes" />
      </sue-flex>
    </template>
  </SemanticPreview>
</template>
```
