# Change progress value position

## Description (en-US)

Change the position of the progress value, you can use `percentPosition` to adjust it so that the progress bar value is inside, outside or at the bottom of the progress bar.

## Source

```vue
<template>
  <sue-flex gap="small" vertical>
    <sue-progress
      :percent="0"
      :percent-position="{ align: 'center', type: 'inner' }"
      :size="[200, 20]"
      stroke-color="#E6F4FF"
    />
    <sue-progress :percent="10" :percent-position="{ align: 'center', type: 'inner' }" :size="[300, 20]" />
    <sue-progress
      :percent="50"
      :percent-position="{ align: 'start', type: 'inner' }"
      :size="[300, 20]"
      stroke-color="#B7EB8F"
    />
    <sue-progress
      :percent="60"
      :percent-position="{ align: 'end', type: 'inner' }"
      :size="[300, 20]"
      stroke-color="#001342"
    />
    <sue-progress :percent="100" :percent-position="{ align: 'center', type: 'inner' }" :size="[400, 20]" />
    <sue-progress :percent="60" :percent-position="{ align: 'start', type: 'outer' }" />
    <sue-progress :percent="100" :percent-position="{ align: 'start', type: 'outer' }" />
    <sue-progress :percent="60" :percent-position="{ align: 'center', type: 'outer' }" size="small" />
    <sue-progress :percent="100" :percent-position="{ align: 'center', type: 'outer' }" />
  </sue-flex>
</template>
```
