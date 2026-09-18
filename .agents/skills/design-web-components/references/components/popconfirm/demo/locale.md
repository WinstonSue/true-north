# Locale text

## Description (en-US)

Set `okText` and `cancelText` props to customize the button's labels.

## Source

```vue
<template>
  <sue-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
  >
    <sue-button danger>
      Delete
    </sue-button>
  </sue-popconfirm>
</template>
```
