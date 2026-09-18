# Smooth Transition

## Description (en-US)

Configure Tooltip unique display through [ConfigProvider global configuration](#config-provider-tooltip-unique) to achieve smooth transition effects with only one Tooltip displayed at a time.

## Source

```vue
<script lang="ts" setup>
import SharedButton from './components/shared-button.vue'
</script>

<template>
  <sue-config-provider
    :tooltip="{
      unique: true,
    }"
  >
    <sue-flex vertical gap="small">
      <sue-flex gap="small" justify="center">
        <SharedButton />
        <SharedButton />
      </sue-flex>
      <sue-flex gap="small" justify="center">
        <SharedButton placement="bottom" />
        <SharedButton placement="bottom" />
      </sue-flex>
    </sue-flex>
  </sue-config-provider>
</template>
```
