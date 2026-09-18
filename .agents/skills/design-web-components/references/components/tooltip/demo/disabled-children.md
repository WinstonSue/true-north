# Disabled children

## Description (en-US)

Disabled wrapper.

## Source

```vue
<script setup lang="ts">
const selectOptions = [
  { value: 'option', label: 'Option' },
]
</script>

<template>
  <sue-space>
    <sue-tooltip title="Thanks for using antd. Have a nice day !">
      <sue-button disabled>
        Disabled
      </sue-button>
    </sue-tooltip>
    <sue-tooltip title="Thanks for using antd. Have a nice day !">
      <sue-input disabled placeholder="disabled" />
    </sue-tooltip>
    <sue-tooltip title="Thanks for using antd. Have a nice day !">
      <sue-input-number disabled :value="1" />
    </sue-tooltip>
    <sue-tooltip title="Thanks for using antd. Have a nice day !">
      <sue-checkbox disabled />
    </sue-tooltip>
    <sue-tooltip title="Thanks for using antd. Have a nice day !">
      <sue-select disabled :options="selectOptions" :value="selectOptions[0].value" />
    </sue-tooltip>
  </sue-space>
</template>
```
