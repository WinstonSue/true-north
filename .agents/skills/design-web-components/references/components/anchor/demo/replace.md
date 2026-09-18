# Replace href in history

## Description (en-US)

Replace path in browser history, so back button returns to previous page instead of previous anchor item.

## Source

```vue
<template>
  <sue-row>
    <sue-col :span="16">
      <div id="part-1" style="height: 100vh; background: rgba(255, 0, 0, 0.02)" />
      <div id="part-2" style="height: 100vh; background: rgba(0, 255, 0, 0.02)" />
      <div id="part-3" style="height: 100vh; background: rgba(0, 0, 255, 0.02)" />
    </sue-col>
    <sue-col :span="8">
      <sue-anchor
        replace
        :items="[
          {
            key: 'part-1',
            href: '#part-1',
            title: 'Part 1',
          },
          {
            key: 'part-2',
            href: '#part-2',
            title: 'Part 2',
          },
          {
            key: 'part-3',
            href: '#part-3',
            title: 'Part 3',
          },
        ]"
      />
    </sue-col>
  </sue-row>
</template>
```
