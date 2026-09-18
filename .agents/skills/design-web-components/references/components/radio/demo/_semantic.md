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
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Radio"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-radio :classes="classes">
        Radio
      </sue-radio>
    </template>
  </SemanticPreview>
</template>
```
