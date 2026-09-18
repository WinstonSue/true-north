# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { CalendarProps } from '@sue/design-web-vue'
import type { Dayjs } from 'dayjs'

const classes = {
  root: 'custom-calendar-root',
}

const stylesObject: CalendarProps<Dayjs>['styles'] = {
  root: {
    borderRadius: '8px',
    width: '600px',
  },
}

const stylesFunction: CalendarProps<Dayjs>['styles'] = (info) => {
  if (info.props.fullscreen) {
    return {
      root: {
        border: '2px solid #BDE3C3',
        borderRadius: '10px',
        backgroundColor: 'rgba(189,227,195, 0.3)',
      },
    } satisfies CalendarProps<Dayjs>['styles']
  }
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-calendar :fullscreen="false" :classes="classes" :styles="stylesObject" />
    <sue-calendar :classes="classes" :styles="stylesFunction" />
  </sue-flex>
</template>

<style scoped>
.custom-calendar-root {
  padding: 10px;
  background-color: #e6f4ff;
}
</style>
```
