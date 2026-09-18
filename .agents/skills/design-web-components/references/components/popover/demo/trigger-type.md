# Three ways to trigger

## Description (en-US)

Mouse to click, focus and move in.

## Source

```vue
<template>
  <sue-space wrap>
    <sue-popover title="Title" trigger="hover">
      <template #content>
        <div>
          <p>Content</p>
          <p>Content</p>
        </div>
      </template>
      <sue-button>Hover me</sue-button>
    </sue-popover>
    <sue-popover title="Title" trigger="focus">
      <template #content>
        <div>
          <p>Content</p>
          <p>Content</p>
        </div>
      </template>
      <sue-button>Focus me</sue-button>
    </sue-popover>
    <sue-popover title="Title" trigger="click">
      <template #content>
        <div>
          <p>Content</p>
          <p>Content</p>
        </div>
      </template>
      <sue-button>Click me</sue-button>
    </sue-popover>
  </sue-space>
</template>
```
