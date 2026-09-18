# Progress bar with success segment

## Description (en-US)

Show several parts of progress with different status.

## Source

```vue
<template>
  <sue-flex gap="small" vertical>
    <sue-tooltip title="3 done / 3 in progress / 4 to do">
      <sue-progress :percent="60" :success="{ percent: 30 }" />
    </sue-tooltip>
    <sue-flex gap="small" wrap>
      <sue-tooltip title="3 done / 3 in progress / 4 to do">
        <sue-progress type="circle" :percent="60" :success="{ percent: 30 }" />
      </sue-tooltip>
      <sue-tooltip title="3 done / 3 in progress / 4 to do">
        <sue-progress type="dashboard" :percent="60" :success="{ percent: 30 }" />
      </sue-tooltip>
    </sue-flex>
  </sue-flex>
</template>
```
