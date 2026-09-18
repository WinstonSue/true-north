# _semantic

## Source

```vue
<script setup lang="ts">
import { LayoutGrid, Menu } from '@lucide/vue'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
])

const options = [
  { label: 'List', value: 'List', icon: h(Menu) },
  { label: 'Kanban', value: 'Kanban', icon: h(LayoutGrid) },
]
</script>

<template>
  <SemanticPreview
    component-name="Segmented"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-segmented :options="options" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
```
