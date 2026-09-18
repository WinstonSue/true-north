# _semantic

## Source

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'mask', desc: t('mask'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'extra', desc: t('extra'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
  { name: 'dragger', desc: t('dragger'), version: '1.0.0' },
  { name: 'close', desc: t('close'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Drawer"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-drawer
        title="Title"
        placement="right"
        open
        :get-container="false"
        :size="300"
        :resizable="{}"
        :classes="classes"
      >
        <template #extra>
          <sue-button>Cancel</sue-button>
        </template>
        <p>Some contents...</p>
      </sue-drawer>
    </template>
  </SemanticPreview>
</template>
```
