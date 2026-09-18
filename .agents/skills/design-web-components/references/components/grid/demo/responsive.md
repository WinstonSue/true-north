# Responsive

## Description (en-US)

Referring to the Bootstrap [responsive design](http://getbootstrap.com/css/#grid-media-queries), here preset seven dimensions: `xs` `sm` `md` `lg` `xl` `xxl` `xxxl`.

## Source

```vue
<template>
  <sue-row>
    <sue-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
      Col
    </sue-col>
    <sue-col :xs="20" :sm="16" :md="12" :lg="8" :xl="4">
      Col
    </sue-col>
    <sue-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
      Col
    </sue-col>
  </sue-row>
</template>
```
