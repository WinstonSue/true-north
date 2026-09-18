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
  { name: 'image', desc: t('image'), version: '1.0.0' },
  { name: 'description', desc: t('description'), version: '1.0.0' },
  { name: 'footer', desc: t('footer'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Empty"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-empty
        :image="1"
        :styles="{ image: { height: '60px' } }"
        :classes="classes"
      >
        <template #description>
          <sue-editable-text>
            Customize <a href="#API">Description</a>
          </sue-editable-text>
        </template>
        <sue-button type="primary">
          Create Now
        </sue-button>
      </sue-empty>
    </template>
  </SemanticPreview>
</template>
```
