# Ghost Button

## Description (en-US)

The `ghost` property will make a button's background transparent, this is commonly used in colored background.

## Source

```vue
<template>
  <sue-flex wrap gap="small" class="site-button-ghost-wrapper">
    <sue-button type="primary" ghost>
      Primary
    </sue-button>
    <sue-button ghost>
      Default
    </sue-button>
    <sue-button type="dashed" ghost>
      Dashed
    </sue-button>
    <sue-button type="primary" danger ghost>
      Danger
    </sue-button>
  </sue-flex>
</template>
```
