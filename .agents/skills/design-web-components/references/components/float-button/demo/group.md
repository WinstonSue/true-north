# FloatButton Group

## Description (en-US)

When multiple buttons are used together, `<sue-float-button-group />` is recommended. By setting the `shape` property of FloatButton.Group, you can change the shape of group. The `shape` of the FloatButton.Group will override the `shape` of FloatButtons inside.

## Source

```vue
<script setup lang="ts">
import { CircleHelp, RefreshCw } from '@lucide/vue'
</script>

<template>
  <sue-float-button-group shape="circle" style="inset-inline-end: 24px;">
    <sue-float-button>
      <template #icon>
        <CircleHelp />
      </template>
    </sue-float-button>
    <sue-float-button />
    <sue-float-back-top :visibility-height="0" />
  </sue-float-button-group>
  <sue-float-button-group shape="square" style="inset-inline-end: 94px;">
    <sue-float-button>
      <template #icon>
        <CircleHelp />
      </template>
    </sue-float-button>
    <sue-float-button />
    <sue-float-button>
      <template #icon>
        <RefreshCw />
      </template>
    </sue-float-button>
    <sue-float-back-top :visibility-height="0" />
  </sue-float-button-group>
</template>
```
