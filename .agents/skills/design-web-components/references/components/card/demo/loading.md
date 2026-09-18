# Loading card

## Description (en-US)

Shows a loading indicator while the contents of the card is being fetched.

## Source

```vue
<script setup lang="ts">
import { Pencil, Ellipsis, Settings } from '@lucide/vue'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <sue-flex gap="middle" align="start" vertical>
    <sue-switch :checked="!loading" @change="(checked: boolean) => loading = !checked" />
    <sue-card :loading="loading" style="min-width: 300px">
      <template #actions>
        <Pencil key="edit" />
        <Settings key="setting" />
        <Ellipsis key="ellipsis" />
      </template>
      <sue-card-meta title="Card title">
        <template #avatar>
          <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </template>
        <template #description>
          <p>This is the description</p>
          <p>This is the description</p>
        </template>
      </sue-card-meta>
    </sue-card>
    <sue-card :loading="loading" style="min-width: 300px">
      <template #actions>
        <Pencil key="edit" />
        <Settings key="setting" />
        <Ellipsis key="ellipsis" />
      </template>
      <sue-card-meta title="Card title">
        <template #avatar>
          <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
        </template>
        <template #description>
          <p>This is the description</p>
          <p>This is the description</p>
        </template>
      </sue-card-meta>
    </sue-card>
  </sue-flex>
</template>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
</style>
```
