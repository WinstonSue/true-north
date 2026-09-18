# Ellipsis

## Description (en-US)

Multiple line ellipsis support. You can use `tooltip` to configure ellipsis tooltip. The `expandable` property is recommended when you have lots of content.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const ellipsis = ref(true)
</script>

<template>
  <sue-switch v-model:checked="ellipsis" />

  <sue-editable-paragraph :ellipsis="ellipsis">
    Antdv Next, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team.
  </sue-editable-paragraph>

  <sue-editable-paragraph :ellipsis="ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false">
    Antdv Next, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team.
  </sue-editable-paragraph>

  <sue-editable-text
    :style="ellipsis ? { width: '200px' } : undefined"
    :ellipsis="ellipsis ? { tooltip: 'I am ellipsis now!' } : false"
  >
    Antdv Next, a design language for background applications, is refined by Ant UED Team.
  </sue-editable-text>

  <sue-editable-text
    code
    :style="ellipsis ? { width: '200px' } : undefined"
    :ellipsis="ellipsis ? { tooltip: 'I am ellipsis now!' } : false"
  >
    Antdv Next, a design language for background applications, is refined by Ant UED Team.
  </sue-editable-text>
</template>
```
