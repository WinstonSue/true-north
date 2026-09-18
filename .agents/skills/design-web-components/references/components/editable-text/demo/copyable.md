# Copyable

## Description (en-US)

Makes EditableText copyable with the click of a button.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import { h } from 'vue'

const customCopyConfig = {
  icon: [h(Smile), h(Smile)],
  tooltips: ['click here', 'you clicked!!'],
}

const asyncCopyConfig = {
  text: async (): Promise<string> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('Request text')
      }, 500)
    }),
}
</script>

<template>
  <sue-editable-paragraph copyable>
    This is a copyable text.
  </sue-editable-paragraph>
  <sue-editable-paragraph :copyable="{ text: 'Hello, Antdv Next!' }">
    Replace copy text.
  </sue-editable-paragraph>
  <sue-editable-paragraph :copyable="customCopyConfig">
    Custom Copy icon and replace tooltips text.
  </sue-editable-paragraph>
  <sue-editable-paragraph :copyable="{ tooltips: false }">
    Hide Copy tooltips.
  </sue-editable-paragraph>
  <sue-editable-paragraph :copyable="asyncCopyConfig">
    Request copy text.
  </sue-editable-paragraph>
  <sue-editable-text :copyable="{ text: 'text to be copied' }" />
</template>
```
