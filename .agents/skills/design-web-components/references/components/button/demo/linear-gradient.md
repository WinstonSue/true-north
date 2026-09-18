# Gradient Button

## Description (en-US)

You can add custom styles by setting `button.classes` in ConfigProvider. This example shows how to add a gradient effect to buttons.

## Source

```vue
<script setup lang="ts">
import { Hexagon } from '@lucide/vue'
</script>

<template>
  <sue-config-provider
    :button="{
      classes: {
        root: 'linear-gradient-button',
      },
    }"
  >
    <sue-space>
      <sue-button type="primary" size="large">
        <template #icon>
          <Hexagon />
        </template>
        Gradient Button
      </sue-button>
      <sue-button size="large">
        Button
      </sue-button>
    </sue-space>
  </sue-config-provider>
</template>

<style>
.linear-gradient-button.sue-btn-primary:not([disabled]):not(.sue-btn-dangerous) {
  position: relative;
}

.linear-gradient-button.sue-btn-primary:not([disabled]):not(.sue-btn-dangerous) > span {
  position: relative;
}

.linear-gradient-button.sue-btn-primary:not([disabled]):not(.sue-btn-dangerous)::before {
  content: '';
  background: linear-gradient(135deg, #6253e1, #04befe);
  position: absolute;
  inset: -1px;
  opacity: 1;
  transition: all 0.3s;
  border-radius: inherit;
}

.linear-gradient-button.sue-btn-primary:not([disabled]):not(.sue-btn-dangerous):hover::before {
  opacity: 0;
}
</style>
```
