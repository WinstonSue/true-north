# Progress size

## Description (en-US)

The size of progress.

## Source

```vue
<template>
  <sue-flex vertical gap="middle">
    <sue-flex vertical gap="small" style="width: 300px">
      <sue-progress :percent="50" />
      <sue-progress :percent="50" size="small" />
      <sue-progress :percent="50" :size="[300, 20]" />
    </sue-flex>
    <sue-flex align="center" wrap :gap="30">
      <sue-progress type="circle" :percent="50" />
      <sue-progress type="circle" :percent="50" size="small" />
      <sue-progress type="circle" :percent="50" :size="20" />
    </sue-flex>
    <sue-flex align="center" wrap :gap="30">
      <sue-progress type="dashboard" :percent="50" />
      <sue-progress type="dashboard" :percent="50" size="small" />
      <sue-progress type="dashboard" :percent="50" :size="20" />
    </sue-flex>
    <sue-flex align="center" wrap :gap="30">
      <sue-progress :steps="3" :percent="50" />
      <sue-progress :steps="3" :percent="50" size="small" />
      <sue-progress :steps="3" :percent="50" :size="20" />
      <sue-progress :steps="3" :percent="50" :size="[20, 30]" />
    </sue-flex>
  </sue-flex>
</template>
```
