# _semantic

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'input', desc: t('input') },
  { name: 'suffix', desc: t('suffix') },
  { name: 'popup.root', desc: t('popup') },
  { name: 'popup.container', desc: t('popup.container') },
  { name: 'popup.header', desc: t('popup.header') },
  { name: 'popup.body', desc: t('popup.body') },
  { name: 'popup.content', desc: t('popup.content') },
  { name: 'popup.item', desc: t('popup.item') },
  { name: 'popup.footer', desc: t('popup.footer') },
])

const type = ref<'Single' | 'Multiple'>('Single')
const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    :component-name="type === 'Single' ? 'DatePicker' : 'DatePicker.RangePicker'"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <sue-flex ref="divRef" vertical :style="{ alignSelf: 'flex-start' }" gap="middle" align="center">
        <sue-segmented
          :options="['Single', 'Multiple']"
          :value="type"
          @change="(val: 'Single' | 'Multiple') => type = val"
        />
        <sue-date-picker
          v-if="type === 'Single'"
          :z-index="1"
          open
          :get-popup-container="() => divRef!"
          need-confirm
          :classes="classes"
        >
          <template #prefix>
            <Smile />
          </template>
        </sue-date-picker>
        <sue-range-picker
          v-else
          :z-index="1"
          open
          :get-popup-container="() => divRef!"
          need-confirm
          :classes="classes"
        >
          <template #prefix>
            <Smile />
          </template>
        </sue-range-picker>
      </sue-flex>
    </template>
  </SemanticPreview>
</template>
```
