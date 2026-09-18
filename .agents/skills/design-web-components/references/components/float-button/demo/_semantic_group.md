# _semantic_group

## Source

```vue
<script setup lang="ts">
import { Bell, Bug, Lightbulb } from '@lucide/vue'
import { FloatButton } from '@sue/design-web-vue'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const PurePanel = (FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('group.root') },
  { name: 'list', desc: t('group.list') },
  { name: 'item', desc: t('group.item') },
  { name: 'itemIcon', desc: t('group.itemIcon') },
  { name: 'itemContent', desc: t('group.itemContent') },
  { name: 'trigger', desc: t('group.trigger') },
  { name: 'triggerIcon', desc: t('group.triggerIcon') },
  { name: 'triggerContent', desc: t('group.triggerContent') },
])

const items = [
  {
    icon: h(Bell),
    content: 'warn',
  },
  {
    icon: h(Bug),
    content: 'bug',
  },
  {
    icon: h(Lightbulb),
    content: 'idea',
  },
]
</script>

<template>
  <SemanticPreview
    component-name="FloatButton"
    :semantics="semantics"
    :style="{ paddingTop: '100px' }"
  >
    <template #default="{ classes }">
      <PurePanel
        type="primary"
        shape="square"
        :items="items"
        trigger="hover"
        :open="true"
        content="back"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
```
