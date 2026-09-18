# Arrow

## Description (en-US)

Hide arrow by `arrow`.

## Source

```vue
<script setup lang="ts">
import type { PopoverProps } from '@sue/design-web-vue'
import { computed, h, shallowRef } from 'vue'

const buttonWidth = shallowRef(80)
const arrow = shallowRef<'Show' | 'Hide' | 'Center'>('Show')
const mergedArrow = computed<PopoverProps['arrow']>(() => {
  if (arrow.value === 'Hide') {
    return false
  }
  if (arrow.value === 'Show') {
    return true
  }
  return { pointAtCenter: true }
})

const title = 'Title'
const content = h('div', [
  h('p', 'Content'),
  h('p', 'Content'),
])
</script>

<template>
  <sue-config-provider :button="{ style: { width: `${buttonWidth}px`, margin: '4px' } }">
    <sue-segmented
      v-model:value="arrow"
      :options="['Show', 'Hide', 'Center']"
      style="margin-bottom: 24px"
    />
    <sue-flex vertical justify="center" align="center" class="demo">
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-popover placement="topLeft" :title="title" :content="content" :arrow="mergedArrow">
          <sue-button>TL</sue-button>
        </sue-popover>
        <sue-popover placement="top" :title="title" :content="content" :arrow="mergedArrow">
          <sue-button>Top</sue-button>
        </sue-popover>
        <sue-popover placement="topRight" :title="title" :content="content" :arrow="mergedArrow">
          <sue-button>TR</sue-button>
        </sue-popover>
      </sue-flex>
      <sue-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <sue-flex align="center" vertical>
          <sue-popover placement="leftTop" :title="title" :content="content" :arrow="mergedArrow">
            <sue-button>LT</sue-button>
          </sue-popover>
          <sue-popover placement="left" :title="title" :content="content" :arrow="mergedArrow">
            <sue-button>Left</sue-button>
          </sue-popover>
          <sue-popover placement="leftBottom" :title="title" :content="content" :arrow="mergedArrow">
            <sue-button>LB</sue-button>
          </sue-popover>
        </sue-flex>
        <sue-flex align="center" vertical>
          <sue-popover placement="rightTop" :title="title" :content="content" :arrow="mergedArrow">
            <sue-button>RT</sue-button>
          </sue-popover>
          <sue-popover placement="right" :title="title" :content="content" :arrow="mergedArrow">
            <sue-button>Right</sue-button>
          </sue-popover>
          <sue-popover placement="rightBottom" :title="title" :content="content" :arrow="mergedArrow">
            <sue-button>RB</sue-button>
          </sue-popover>
        </sue-flex>
      </sue-flex>
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-popover placement="bottomLeft" :title="title" :content="content" :arrow="mergedArrow">
          <sue-button>BL</sue-button>
        </sue-popover>
        <sue-popover placement="bottom" :title="title" :content="content" :arrow="mergedArrow">
          <sue-button>Bottom</sue-button>
        </sue-popover>
        <sue-popover placement="bottomRight" :title="title" :content="content" :arrow="mergedArrow">
          <sue-button>BR</sue-button>
        </sue-popover>
      </sue-flex>
    </sue-flex>
  </sue-config-provider>
</template>
```
