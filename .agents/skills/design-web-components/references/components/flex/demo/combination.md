# combination

## Description (en-US)

Nesting can achieve more complex layouts.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'

const cardStyle: CSSProperties = {
  width: '620px',
}
const imgStyle: CSSProperties = {
  display: 'block',
  width: '273px',
}
</script>

<template>
  <sue-card :style="cardStyle" :styles="{ body: { padding: 0, overflow: 'hidden' } }">
    <sue-flex justify="space-between">
      <img
        alt="avatar"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        :style="imgStyle"
      >
      <sue-flex vertical align="flex-end" justify="space-between" :style="{ padding: '32px' }">
        <div>
          <sue-editable-text :level="3">
            “antd is an enterprise-class UI design language and Vue UI library.”
          </sue-editable-text>
        </div>
        <sue-button type="primary" href="https://antdv.com" target="_blank">
          Get Start
        </sue-button>
      </sue-flex>
    </sue-flex>
  </sue-card>
</template>
```
