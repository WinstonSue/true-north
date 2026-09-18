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
  { name: 'indicator', desc: t('indicator'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Badge"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-badge :count="5" :classes="classes">
        <sue-avatar shape="square" size="large" />
      </sue-badge>
    </template>
  </SemanticPreview>
</template>
```
