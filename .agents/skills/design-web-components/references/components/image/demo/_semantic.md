# _semantic

## Source

```vue
<script setup lang="ts">
import { theme } from '@sue/design-web-vue'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'image', desc: t('image') },
  { name: 'cover', desc: t('cover') },
  { name: 'popup.root', desc: t('popup.root') },
  { name: 'popup.mask', desc: t('popup.mask') },
  { name: 'popup.body', desc: t('popup.body') },
  { name: 'popup.footer', desc: t('popup.footer') },
  { name: 'popup.actions', desc: t('popup.actions') },
  { name: 'popup.close', desc: t('popup.close'), version: '1.3.0' },
])

const { token } = theme.useToken()
const holderRef = ref<HTMLDivElement | null>(null)

const previewItems = [
  'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
]
</script>

<template>
  <SemanticPreview
    component-name="Image"
    :padding="false"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-flex vertical align="center" :style="{ minHeight: '100%', width: '100%' }">
        <sue-flex :style="{ padding: `${token.padding}px`, flex: 'none' }" justify="center">
          <sue-image
            :width="200"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            :classes="classes"
            :preview="{ getContainer: () => holderRef! }"
          />
        </sue-flex>
        <div ref="holderRef" :style="{ flex: 1, position: 'relative', minHeight: '500px', width: '100%' }">
          <sue-image-preview-group
            :items="previewItems"
            :classes="classes"
            :styles="{ popup: { root: { position: 'absolute' } } }"
            :preview="{ getContainer: () => holderRef!, open: true }"
          />
        </div>
      </sue-flex>
    </template>
  </SemanticPreview>
</template>
```
