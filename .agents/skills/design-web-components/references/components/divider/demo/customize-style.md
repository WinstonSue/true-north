# Style Customization

## Description (en-US)

Customize the style of the divider.

## Source

```vue
<template>
  <sue-divider :style="{ borderWidth: '2px', borderColor: '#7cb305' }" />
  <sue-divider :style="{ borderColor: '#7cb305' }" dashed />
  <sue-divider :style="{ borderColor: '#7cb305' }" dashed>
    Text
  </sue-divider>
  <sue-divider type="vertical" :style="{ height: '60px', borderColor: '#7cb305' }" />
  <sue-divider type="vertical" :style="{ height: '60px', borderColor: '#7cb305' }" dashed />

  <div :style="{ display: 'flex', flexDirection: 'column', height: '50px', boxShadow: '0 0 1px red' }">
    <sue-divider :style="{ background: 'rgba(0,255,0,0.05)' }" title-placement="left">
      Text
    </sue-divider>
  </div>
</template>
```
