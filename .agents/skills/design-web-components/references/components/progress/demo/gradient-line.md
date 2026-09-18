# Custom line gradient

## Description (en-US)

Gradient encapsulation, `circle` and `dashboard` will ignore `strokeLinecap` when setting gradient.

## Source

```vue
<script setup lang="ts">
const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
}

const conicColors = {
  '0%': '#87d068',
  '50%': '#ffe58f',
  '100%': '#ffccc7',
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-progress :percent="99.9" :stroke-color="twoColors" />
    <sue-progress :percent="50" status="active" :stroke-color="{ from: '#108ee9', to: '#87d068' }" />
    <sue-flex gap="small" wrap>
      <sue-progress type="circle" :percent="90" :stroke-color="twoColors" />
      <sue-progress type="circle" :percent="100" :stroke-color="twoColors" />
      <sue-progress type="circle" :percent="93" :stroke-color="conicColors" />
    </sue-flex>
    <sue-flex gap="small" wrap>
      <sue-progress type="dashboard" :percent="90" :stroke-color="twoColors" />
      <sue-progress type="dashboard" :percent="100" :stroke-color="twoColors" />
      <sue-progress type="dashboard" :percent="93" :stroke-color="conicColors" />
    </sue-flex>
  </sue-flex>
</template>
```
