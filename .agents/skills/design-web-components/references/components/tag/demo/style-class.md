# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import { CircleCheck, CircleX } from '@lucide/vue'

const tagStyles = {
  root: {
    backgroundColor: '#e6f7ff',
  },
  icon: {
    color: '#52c41a',
  },
  content: {
    color: '#262626',
  },
}

const filledTagStyles = {
  root: {
    backgroundColor: '#F5EFFF',
  },
  icon: {
    color: '#8F87F1',
  },
  content: {
    color: '#8F87F1',
  },
}

const groupStyles = {
  root: {
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: 'rgba(82, 196, 26, 0.08)',
    borderRadius: '8px',
  },
  item: {
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    borderColor: 'rgba(82, 196, 26, 0.3)',
    color: '#52c41a',
  },
}

const multipleGroupStyles = {
  root: {
    gap: '16px',
    padding: '8px 12px',
    backgroundColor: 'rgba(143, 135, 241, 0.08)',
    borderRadius: '8px',
  },
  item: {
    backgroundColor: 'rgba(143, 135, 241, 0.1)',
    borderColor: 'rgba(143, 135, 241, 0.3)',
    color: '#8F87F1',
    fontWeight: 500,
  },
}

const options1 = ['React', 'Vue', 'Angular']
const options2 = ['meet-student', 'thinkasany']
</script>

<template>
  <sue-space size="large" vertical>
    <sue-flex gap="middle">
      <sue-tag :classes="{ root: 'custom-tag-root' }" :styles="tagStyles">
        <template #icon>
          <CircleCheck />
        </template>
        Object
      </sue-tag>
      <sue-tag
        variant="filled"
        :classes="{ root: 'custom-tag-root' }"
        :styles="filledTagStyles"
      >
        <template #icon>
          <CircleX />
        </template>
        Function
      </sue-tag>
    </sue-flex>
    <sue-flex vertical gap="middle">
      <sue-checkable-tag-group
        :classes="{ root: 'custom-tag-root' }"
        :styles="groupStyles"
        :options="options1"
      />
      <sue-checkable-tag-group
        :classes="{ root: 'custom-tag-root' }"
        :styles="multipleGroupStyles"
        :options="options2"
        multiple
      />
    </sue-flex>
  </sue-space>
</template>

<style scoped>
.custom-tag-root {
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
```
