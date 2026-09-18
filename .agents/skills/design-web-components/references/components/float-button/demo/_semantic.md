# _semantic

## Source

```vue
<script setup lang="ts">
import { CircleHelp } from '@lucide/vue'
import { FloatButton } from '@sue/design-web-vue'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const PurePanel = (FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'icon', desc: t('icon') },
  { name: 'content', desc: t('content') },
])
</script>

<template>
  <SemanticPreview
    component-name="FloatButton"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <PurePanel
        type="primary"
        shape="square"
        content="HELP"
        :classes="classes"
      >
        <template #icon>
          <CircleHelp />
        </template>
      </PurePanel>
    </template>
  </SemanticPreview>
</template>
```
