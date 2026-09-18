# Controlled ellipsis expand/collapse

## Description (en-US)

Controlled multi line text omission.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const rows = ref(2)
const expanded = ref(false)

const text = 'Antdv Next, a design language for background applications, is refined by Ant UED Team.'.repeat(20)

function handleExpand(_: MouseEvent, info: { expanded: boolean }) {
  expanded.value = info.expanded
}
</script>

<template>
  <sue-flex :gap="16" vertical>
    <sue-flex :gap="16" align="center">
      <sue-switch v-model:checked="expanded" style="flex: none;" />
      <sue-slider v-model:value="rows" :min="1" :max="20" style="flex: auto;" />
    </sue-flex>

    <sue-editable-paragraph
      :ellipsis="{
        rows,
        expandable: 'collapsible',
        expanded,
        onExpand: handleExpand,
      }"
      copyable
    >
      {{ text }}
    </sue-editable-paragraph>
  </sue-flex>
</template>
```
