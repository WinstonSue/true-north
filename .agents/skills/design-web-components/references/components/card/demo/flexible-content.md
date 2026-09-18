# Customized content

## Description (en-US)

You can use `sue-card-meta` to support more flexible content.

## Source

```vue
<template>
  <sue-card hoverable style="width: 240px">
    <template #cover>
      <img
        draggable="false"
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      >
    </template>
    <sue-card-meta title="Europe Street beat" description="www.instagram.com" />
  </sue-card>
</template>
```
