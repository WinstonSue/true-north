# _semantic

## Source

```vue
<script setup lang="ts">
import { Hexagon } from '@lucide/vue'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Button"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-button type="primary" :classes="classes">
        <template #icon>
          <Hexagon />
        </template>
        Antdv Next
      </sue-button>
    </template>
  </SemanticPreview>
</template>
```
