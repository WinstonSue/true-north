# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { InputNumberProps } from '@sue/design-web-vue'

const shardStyle = {
  root: 'shard',
}
const styleObject: InputNumberProps['styles'] = {
  input: {
    fontSize: '14px',
  },
}
const styleFn: InputNumberProps['styles'] = ({ props }) => {
  if (props.size === 'large') {
    return {
      root: {
        backgroundColor: 'rgba(250,250,250, 0.5)',
        borderColor: '#722ed1',
      },
    } satisfies InputNumberProps['styles']
  }
  return {}
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-input-number :classes="shardStyle" :styles="styleObject" placeholder="Object" />
    <sue-input-number :classes="shardStyle" :styles="styleFn" placeholder="Function" size="large" />
  </sue-flex>
</template>

<style scoped>
.shard {
  border: 1px solid #1677ff;
  border-radius: 8px;
  width: 200px;
}
</style>
```
