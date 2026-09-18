# Icon

## Description (en-US)

You can add a custom icon to the tag via the `icon` slot.

## Source

```vue
<script setup lang="ts">
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined, YoutubeOutlined } from '@sue/design-web-vue'
import { ref } from 'vue'

const checked = ref<[boolean, boolean, boolean, boolean]>([true, false, false, false])

function handleChange(index: number, value: boolean) {
  checked.value[index] = value
}
</script>

<template>
  <sue-divider title-placement="start">
    Tag with icon
  </sue-divider>
  <sue-flex gap="small" wrap align="center">
    <sue-tag color="#55acee">
      <template #icon>
        <TwitterOutlined />
      </template>
      Twitter
    </sue-tag>
    <sue-tag color="#cd201f">
      <template #icon>
        <YoutubeOutlined />
      </template>
      Youtube
    </sue-tag>
    <sue-tag color="#3b5999">
      <template #icon>
        <FacebookOutlined />
      </template>
      Facebook
    </sue-tag>
    <sue-tag color="#55acee">
      <template #icon>
        <LinkedinOutlined />
      </template>
      LinkedIn
    </sue-tag>
  </sue-flex>
  <sue-divider title-placement="start">
    CheckableTag with icon
  </sue-divider>
  <sue-flex gap="small" wrap align="center">
    <sue-checkable-tag
      :checked="checked[0]"
      @change="(value: boolean) => handleChange(0, value)"
    >
      <template #icon>
        <TwitterOutlined />
      </template>
      Twitter
    </sue-checkable-tag>
    <sue-checkable-tag
      :checked="checked[1]"
      @change="(value: boolean) => handleChange(1, value)"
    >
      <template #icon>
        <YoutubeOutlined />
      </template>
      Youtube
    </sue-checkable-tag>
    <sue-checkable-tag
      :checked="checked[2]"
      @change="(value: boolean) => handleChange(2, value)"
    >
      <template #icon>
        <FacebookOutlined />
      </template>
      Facebook
    </sue-checkable-tag>
    <sue-checkable-tag
      :checked="checked[3]"
      @change="(value: boolean) => handleChange(3, value)"
    >
      <template #icon>
        <LinkedinOutlined />
      </template>
      LinkedIn
    </sue-checkable-tag>
  </sue-flex>
</template>
```
