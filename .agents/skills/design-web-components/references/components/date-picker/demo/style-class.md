# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { DatePickerProps } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'

const { useToken } = theme
const { token } = useToken()

const customClasses = {
  root: 'custom-datepicker-root',
}

const stylesObject: DatePickerProps['styles'] = {
  input: { fontStyle: 'italic' },
  suffix: { opacity: 0.85 },
}

const stylesFn: DatePickerProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: { borderColor: '#722ed1' },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: '8px' },
      },
    }
  }
  return {}
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-date-picker :classes="customClasses" :styles="stylesObject" placeholder="Object" />
    <sue-date-picker :classes="customClasses" :styles="stylesFn" placeholder="Function" size="large" />
  </sue-flex>
</template>

<style scoped>
.custom-datepicker-root {
  border: 1px solid v-bind('token.colorPrimary');
  width: 200px;
}
</style>
```
