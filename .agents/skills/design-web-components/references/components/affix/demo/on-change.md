# Callback

## Description (en-US)

Callback with affixed state.

## Source

```vue
<template>
  <sue-affix :offset-top="120" @change="(affixed) => console.log(affixed)">
    <sue-button>
      120px to affix top
    </sue-button>
  </sue-affix>
</template>
```
