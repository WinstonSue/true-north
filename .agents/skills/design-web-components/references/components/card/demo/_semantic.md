# _semantic

## Source

```vue
<script setup lang="ts">
import { Pencil, Ellipsis, Settings } from '@lucide/vue'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'extra', desc: t('extra'), version: '1.0.0' },
  { name: 'cover', desc: t('cover'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
  { name: 'actions', desc: t('actions'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Card"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute' }">
        <sue-card
          title="Card title"
          extra="More"
          :style="{ width: '300px' }"
          :classes="classes"
        >
          <template #cover>
            <img
              draggable="false"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            >
          </template>
          <template #actions>
            <Settings key="setting" />
            <Pencil key="edit" />
            <Ellipsis key="ellipsis" />
          </template>
          <sue-card-meta
            title="Card Meta title"
            description="This is the description"
          >
            <template #avatar>
              <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
            </template>
          </sue-card-meta>
        </sue-card>
      </div>
    </template>
  </SemanticPreview>
</template>
```
