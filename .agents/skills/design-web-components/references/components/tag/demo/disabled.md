# Disabled

## Description (en-US)

Set the `disabled` property to make the tag unusable.

## Source

```vue
<script setup lang="ts">
import { CircleCheck, CircleX } from '@lucide/vue'
import { message } from '@sue/design-web-vue'
import { ref } from 'vue'

const selectedTags = ref<string[]>(['Books'])
function handleClose(tagName: string) {
  console.log(`Tag ${tagName} closed`)
  message.info(`Tag ${tagName} closed`)
};
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-flex gap="small" wrap>
      <sue-tag disabled>
        Basic Tag
      </sue-tag>
      <sue-tag disabled>
        <a href="https://ant.design">Link Tag</a>
      </sue-tag>
      <sue-tag disabled href="https://ant.design">
        Href Tag
      </sue-tag>
      <sue-tag disabled color="success">
        Icon Tag
        <template #icon>
          <CircleCheck />
        </template>
      </sue-tag>
    </sue-flex>
  </sue-flex>

  <sue-flex gap="small" wrap>
    <sue-tag disabled color="red">
      Preset Color Red
    </sue-tag>
    <sue-tag disabled color="#f50">
      Custom Color #f50 Outlined
    </sue-tag>
    <sue-tag disabled color="#f50" variant="solid">
      Custom Color #f50 Filled
    </sue-tag>
    <sue-tag disabled color="#f50" variant="filled">
      Custom Color #f50 Borderless
    </sue-tag>
    <sue-tag disabled color="success">
      Preset Status Success
    </sue-tag>
  </sue-flex>

  <sue-flex gap="small" wrap>
    <template v-for="tag in ['Books', 'Movies', 'Music']" :key="tag">
      <sue-checkable-tag :checked="selectedTags.includes(tag)" disabled :value="selectedTags.includes(tag)">
        {{ tag }}
      </sue-checkable-tag>
    </template>
  </sue-flex>

  <sue-flex gap="small" wrap>
    <sue-tag disabled closable @close="() => handleClose('Closable')">
      Closable Tag
    </sue-tag>
    <sue-tag disabled closable color="success" @close="() => handleClose('Closable Success')">
      Closable with Icon
      <template #icon>
        <CircleCheck />
      </template>
    </sue-tag>
    <sue-tag disabled closable>
      Closable with Custom Icon
      <template #closeIcon>
        <CircleX />
      </template>
    </sue-tag>
  </sue-flex>

  <sue-flex gap="small" wrap>
    <sue-tag disabled variant="filled">
      Borderless Basic
    </sue-tag>
    <sue-tag disabled variant="filled" color="success">
      Borderless with Icon
      <template #icon>
        <CircleCheck />
      </template>
    </sue-tag>
    <sue-tag disabled variant="filled" closable @close="() => handleClose('Borderless Closable')">
      Borderless Closable
    </sue-tag>
  </sue-flex>
</template>
```
