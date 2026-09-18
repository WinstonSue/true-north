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
  { name: 'rail', desc: t('rail') },
  { name: 'content', desc: t('content') },
])
</script>

<template>
  <SemanticPreview
    component-name="Divider"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <sue-divider :classes="classes" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <sue-divider :classes="classes">
          Solid
        </sue-divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <sue-divider title-placement="left" variant="dotted" :classes="classes">
          Dotted
        </sue-divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <sue-divider title-placement="right" variant="dashed" :classes="classes">
          Dashed
        </sue-divider>
        These
        <sue-divider orientation="vertical" :classes="classes" />
        are
        <sue-divider orientation="vertical" :classes="classes" />
        vertical
        <sue-divider orientation="vertical" :classes="classes" />
        Dividers
      </div>
    </template>
  </SemanticPreview>
</template>
```
