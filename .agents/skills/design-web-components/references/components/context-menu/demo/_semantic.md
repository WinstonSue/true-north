# Semantic DOM

## Source

```vue
<script setup lang="ts">
import { Trash2, Pencil, Save } from '@lucide/vue'
import { computed, h, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'itemTitle', desc: t('itemTitle') },
  { name: 'item', desc: t('item') },
  { name: 'itemContent', desc: t('itemContent') },
  { name: 'itemIcon', desc: t('itemIcon') },
])

const divRef = ref<HTMLDivElement | null>(null)

const items: any[] = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      { key: '1-1', label: '1st menu item', icon: h(Save) },
      { key: '1-2', label: '2nd menu item', icon: h(Pencil) },
    ],
  },
  {
    key: 'SubMenu',
    label: 'SubMenu',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
  { key: '3', type: 'divider' },
  { key: '4', label: 'Delete', icon: h(Trash2), danger: true },
]
</script>

<template>
  <SemanticPreview
    component-name="ContextMenu"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ height: '120px', position: 'absolute', top: '50px' }">
        <sue-context-menu
          open
          :menu="{ items }"
          :styles="{ root: { width: '200px', zIndex: 1 } }"
          :get-popup-container="() => divRef!"
          :classes="classes"
        >
          <a @click.prevent>
            Right Click on here
          </a>
        </sue-context-menu>
      </div>
    </template>
  </SemanticPreview>
</template>
```
