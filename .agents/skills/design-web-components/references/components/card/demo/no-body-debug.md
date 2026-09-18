# Cover and actions without body

## Source

```vue
<script setup lang="ts">
const cover = 'https://api.dicebear.com/7.x/miniavs/svg?seed=8'
</script>

<template>
  <sue-card style="width: 300px">
    <template #cover>
      <img alt="example" :src="cover">
    </template>
    <template #actions>
      <span key="setting">setting</span>
      <span key="edit">edit</span>
    </template>
  </sue-card>
</template>
```
