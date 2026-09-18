# Non-uniform radius

## Description (en-US)

For clipped containers or non-uniform radii, the `outset` prop controls how far the beam sits outside the container edge. Set it to `0` to align the beam exactly with the container border.

## Source

```vue
<template>
  <div :style="{ width: '360px' }">
    <sue-border-beam :outset="0">
      <sue-card
        title="Activity stream"
        :style="{ borderRadius: '20px 20px 0 0', overflow: 'hidden' }"
        :styles="{ body: { display: 'flex', flexDirection: 'column', gap: '16px' } }"
      >
        <sue-editable-text type="secondary">
          Use a multi-value <code>border-radius</code> like <code>20px 20px 0 0</code> to keep the beam aligned with non-uniform corners.
        </sue-editable-text>
        <sue-flex align="center" justify="space-between">
          <sue-editable-text strong>
            12 running jobs
          </sue-editable-text>
          <sue-button type="primary">
            View queue
          </sue-button>
        </sue-flex>
      </sue-card>
    </sue-border-beam>
  </div>
</template>
```
