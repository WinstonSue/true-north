# Imperative open

## Description (en-US)

Open a regular drawer imperatively with `Drawer.open`, then update and destroy it from the returned instance.

## Source (Vue)

```vue
<script setup lang="ts">
import { Drawer } from '@sue/design-web-vue'

function openDrawer() {
  const instance = Drawer.open({
    title: 'Static Drawer',
    content: 'This drawer is created by Drawer.open().',
  })

  setTimeout(() => {
    instance.update(prevConfig => ({
      ...prevConfig,
      title: 'Updated Static Drawer',
      content: 'The content was updated by instance.update().',
    }))
  }, 1000)

  setTimeout(() => {
    instance.destroy()
  }, 2500)
}
</script>

<template>
  <sue-button type="primary" @click="openDrawer">
    Open with Drawer.open
  </sue-button>
</template>
```

## Source (React)

```tsx
import { Button, Drawer } from '@sue/design-web-react';

function openDrawer() {
  const instance = Drawer.open({
    title: 'Static Drawer',
    content: 'This drawer is created by Drawer.open().',
  });

  setTimeout(() => {
    instance.update((prevConfig) => ({
      ...prevConfig,
      title: 'Updated Static Drawer',
      content: 'The content was updated by instance.update().',
    }));
  }, 1000);

  setTimeout(() => {
    instance.destroy();
  }, 2500);
}

export default () => (
  <Button type="primary" onClick={openDrawer}>
    Open with Drawer.open
  </Button>
);
```
