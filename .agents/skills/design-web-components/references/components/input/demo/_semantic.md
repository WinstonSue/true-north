# _semantic

## Source

```vue
<script setup lang="ts">
import { Pencil, User } from '@lucide/vue'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'input', desc: t('input') },
  { name: 'suffix', desc: t('suffix') },
  { name: 'count', desc: t('count') },
  { name: 'clear', desc: t('clear'), version: '1.3.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Input"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div style="width: 100%">
        <sue-input
          default-value="Hello, Antdv-Next"
          show-count
          allow-clear
          :classes="classes"
        >
          <template #prefix>
            <User />
          </template>
          <template #suffix>
            <Pencil />
          </template>
        </sue-input>
      </div>
    </template>
  </SemanticPreview>
</template>
```
