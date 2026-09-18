# preview mask

## Description (en-US)

mask effect, default `blur`.

## Source

```vue
<template>
  <sue-image
    :width="100"
    alt="Default blur"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    :preview="{
      mask: true,
    }"
  >
    <template #cover>
      <sue-space vertical align="center">
        Default blur
      </sue-space>
    </template>
  </sue-image>
  <sue-image
    :width="100"
    alt="Dimmed mask"
    src="https://www.@sue/design-web-vue.com/@sue/design-web-vue.svg"
    :preview="{
      mask: { blur: false },
    }"
  >
    <template #cover>
      <sue-space vertical align="center">
        Dimmed mask
      </sue-space>
    </template>
  </sue-image>
  <sue-image
    :width="100"
    alt="No mask"
    src="https://cn.vuejs.org/logo.svg"
    :preview="{
      mask: false,
    }"
  >
    <template #cover>
      <sue-space vertical align="center">
        No mask
      </sue-space>
    </template>
  </sue-image>
</template>
```
