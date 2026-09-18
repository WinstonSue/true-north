# Placement

## Description (en-US)

There are 12 placement options available.

## Source

```vue
<script setup lang="ts">
const text = 'prompt text'
const buttonWidth = 80
</script>

<template>
  <sue-config-provider :button="{ style: { width: `${buttonWidth}px`, margin: '4px' } }">
    <sue-flex vertical justify="center" align="center" class="demo">
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-tooltip placement="topLeft" :title="text">
          <sue-button>TL</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="top" :title="text">
          <sue-button>Top</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="topRight" :title="text">
          <sue-button>TR</sue-button>
        </sue-tooltip>
      </sue-flex>
      <sue-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <sue-flex align="center" vertical>
          <sue-tooltip placement="leftTop" :title="text">
            <sue-button>LT</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="left" :title="text">
            <sue-button>Left</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="leftBottom" :title="text">
            <sue-button>LB</sue-button>
          </sue-tooltip>
        </sue-flex>
        <sue-flex align="center" vertical>
          <sue-tooltip placement="rightTop" :title="text">
            <sue-button>RT</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="right" :title="text">
            <sue-button>Right</sue-button>
          </sue-tooltip>
          <sue-tooltip placement="rightBottom" :title="text">
            <sue-button>RB</sue-button>
          </sue-tooltip>
        </sue-flex>
      </sue-flex>
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-tooltip placement="bottomLeft" :title="text">
          <sue-button>BL</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="bottom" :title="text">
          <sue-button>Bottom</sue-button>
        </sue-tooltip>
        <sue-tooltip placement="bottomRight" :title="text">
          <sue-button>BR</sue-button>
        </sue-tooltip>
      </sue-flex>
    </sue-flex>
  </sue-config-provider>
</template>
```
