# Trigger size

## Description (en-US)

Antdv Next supports three trigger sizes: small, medium and large.

If a large or small trigger is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a trigger with the medium size.

## Source

```vue
<template>
  <sue-space>
    <sue-space vertical>
      <sue-color-picker default-value="#1677ff" size="small" />
      <sue-color-picker default-value="#1677ff" />
      <sue-color-picker default-value="#1677ff" size="large" />
    </sue-space>
    <sue-space vertical>
      <sue-color-picker default-value="#1677ff" size="small" show-text />
      <sue-color-picker default-value="#1677ff" show-text />
      <sue-color-picker default-value="#1677ff" size="large" show-text />
    </sue-space>
  </sue-space>
</template>
```
