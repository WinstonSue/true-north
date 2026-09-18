# Block Button

## Description (en-US)

The `block` property will make a button fit to its parent width.

## Source

```vue
<template>
  <sue-flex vertical gap="small" style="width: 100%">
    <sue-button type="primary" block>
      Primary
    </sue-button>
    <sue-button block>
      Default
    </sue-button>
    <sue-button type="dashed" block>
      Dashed
    </sue-button>
    <sue-button disabled block>
      disabled
    </sue-button>
    <sue-button type="text" block>
      text
    </sue-button>
    <sue-button type="link" block>
      Link
    </sue-button>
  </sue-flex>
</template>
```
