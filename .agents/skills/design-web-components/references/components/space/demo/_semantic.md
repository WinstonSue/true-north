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
  { name: 'root', desc: t('root') },
  { name: 'item', desc: t('item') },
  { name: 'separator', desc: t('separator') },
])
</script>

<template>
  <SemanticPreview
    component-name="Space"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-space :classes="classes">
        <template #separator>
          <sue-divider vertical />
        </template>
        <sue-button type="primary">
          Primary
        </sue-button>
        <sue-button>Default</sue-button>
        <sue-button type="dashed">
          Dashed
        </sue-button>
      </sue-space>
    </template>
  </SemanticPreview>
</template>
```
