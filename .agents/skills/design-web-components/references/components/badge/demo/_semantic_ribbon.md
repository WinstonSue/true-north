# _semantic_ribbon

## Source

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('ribbonRoot'), version: '1.0.0' },
  { name: 'indicator', desc: t('ribbonIndicator'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <SemanticPreview
      component-name="Badge"
      :semantics="semantics"
    >
      <template #default="{ classes }">
        <div style="width: 100%;">
          <sue-badge-ribbon text="Hippies" color="magenta" :classes="classes">
            <sue-card title="Pushes open the window" size="small">
              and raises the spyglass.
            </sue-card>
          </sue-badge-ribbon>
        </div>
      </template>
    </SemanticPreview>
  </div>
</template>
```
