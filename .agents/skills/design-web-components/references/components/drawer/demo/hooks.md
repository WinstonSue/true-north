# Hooks usage

## Description (en-US)

Use `Drawer.useDrawer` to create a context-aware `contextHolder` and open or update drawers imperatively in a workflow.

## Source (Vue)

```vue
<script setup lang="ts">
import { Drawer } from '@sue/design-web-vue'

const [drawer, ContextHolder] = Drawer.useDrawer()

function openDrawer() {
  const instance = drawer.open({
    title: 'Hook Drawer',
    content: 'Loading details...',
  })

  setTimeout(() => {
    instance.update({
      title: 'Hook Drawer Updated',
      content: 'Details loaded.',
    })

    setTimeout(() => {
      instance.destroy()
    }, 1000)
  }, 1000)
}
</script>

<template>
  <ContextHolder />
  <sue-button type="primary" @click="openDrawer">
    Open with hooks
  </sue-button>
</template>
```

## Source (React)

```tsx
import { Button, Drawer } from '@sue/design-web-react';

export default () => {
  const [drawer, contextHolder] = Drawer.useDrawer();

  const openDrawer = () => {
    const instance = drawer.open({
      title: 'Hook Drawer',
      content: 'Loading details...',
    });

    setTimeout(() => {
      instance.update({
        title: 'Hook Drawer Updated',
        content: 'Details loaded.',
      });

      setTimeout(() => {
        instance.destroy();
      }, 1000);
    }, 1000);
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={openDrawer}>
        Open with hooks
      </Button>
    </>
  );
};
```
