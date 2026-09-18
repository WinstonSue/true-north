# Grid card

## Description (en-US)

Grid style card content.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
}
</script>

<template>
  <sue-card title="Card Title">
    <sue-card-grid :style="gridStyle">
      Content
    </sue-card-grid>
    <sue-card-grid :hoverable="false" :style="gridStyle">
      Content
    </sue-card-grid>
    <sue-card-grid :style="gridStyle">
      Content
    </sue-card-grid>
    <sue-card-grid :style="gridStyle">
      Content
    </sue-card-grid>
    <sue-card-grid :style="gridStyle">
      Content
    </sue-card-grid>
    <sue-card-grid :style="gridStyle">
      Content
    </sue-card-grid>
    <sue-card-grid :style="gridStyle">
      Content
    </sue-card-grid>
  </sue-card>
</template>
```
