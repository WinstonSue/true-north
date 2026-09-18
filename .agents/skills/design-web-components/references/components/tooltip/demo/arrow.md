# Arrow

## Description (en-US)

Support show, hide or keep arrow in the center.

## Source

```vue
<script setup lang="ts">
import type { TooltipProps } from '@sue/design-web-vue'
import { computed, shallowRef } from 'vue'

const buttonWidth = shallowRef(80)
const arrow = shallowRef<'Show' | 'Hide' | 'Center'>('Show')
const mergedArrow = computed<TooltipProps['arrow']>(() => {
  if (arrow.value === 'Show') {
    return true
  }
  else if (arrow.value === 'Hide') {
    return false
  }
  return { pointAtCenter: true }
})
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
        <sue-tooltip placement="topLeft" title="prompt text" :arrow="mergedArrow">
          <sue-button>TL</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="top" title="prompt text" :arrow="mergedArrow">
          <sue-button>Top</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="topRight" title="prompt text" :arrow="mergedArrow">
          <sue-button>TR</sue-button>
        </sue-tooltip>
      </sue-flex>
      <sue-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <sue-flex align="center" vertical>
          <sue-tooltip placement="leftTop" title="prompt text" :arrow="mergedArrow">
            <sue-button>LT</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="left" title="prompt text" :arrow="mergedArrow">
            <sue-button>Left</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="leftBottom" title="prompt text" :arrow="mergedArrow">
            <sue-button>LB</sue-button>
          </sue-tooltip>
        </sue-flex>
        <sue-flex align="center" vertical>
          <sue-tooltip placement="rightTop" title="prompt text" :arrow="mergedArrow">
            <sue-button>RT</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="right" title="prompt text" :arrow="mergedArrow">
            <sue-button>Right</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="rightBottom" title="prompt text" :arrow="mergedArrow">
            <sue-button>RB</sue-button>
          </sue-tooltip>
        </sue-flex>
      </sue-flex>
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-tooltip placement="bottomLeft" title="prompt text" :arrow="mergedArrow">
          <sue-button>BL</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="bottom" title="prompt text" :arrow="mergedArrow">
          <sue-button>Bottom</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="bottomRight" title="prompt text" :arrow="mergedArrow">
          <sue-button>BR</sue-button>
        </sue-tooltip>
      </sue-flex>
    </sue-flex>
  </sue-config-provider>
</template>
```
