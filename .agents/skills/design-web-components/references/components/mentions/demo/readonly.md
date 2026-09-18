# disabled or readOnly

## Description (en-US)

Configure `disabled` and `readOnly`.

## Source

```vue
<script setup lang="ts">
import type { MentionsProps } from '@sue/design-web-vue'

const options: MentionsProps['options'] = ['afc163', 'zombiej', 'yesmeck'].map(value => ({
  value,
  key: value,
  label: value,
}))
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-mentions
      style="width: 100%"
      placeholder="this is disabled Mentions"
      disabled
      :options="options"
    />
    <sue-mentions
      style="width: 100%"
      placeholder="this is readOnly Mentions"
      readonly
      :options="options"
    />
  </sue-flex>
</template>
```
