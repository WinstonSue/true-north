# Variants

## Description (en-US)

Variants of TimePicker, there are four variants: `outlined` `filled` `borderless` and `underlined`.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-flex vertical :gap="12">
    <sue-flex :gap="8">
      <sue-time-picker placeholder="Outlined" />
      <sue-time-range-picker :placeholder="['Outlined Start', 'Outlined End']" />
    </sue-flex>
    <sue-flex :gap="8">
      <sue-time-picker variant="filled" placeholder="Filled" />
      <sue-time-range-picker variant="filled" :placeholder="['Filled Start', 'Filled End']" />
    </sue-flex>
    <sue-flex :gap="8">
      <sue-time-picker variant="borderless" placeholder="Borderless" />
      <sue-time-range-picker variant="borderless" :placeholder="['Borderless Start', 'Borderless End']" />
    </sue-flex>
    <sue-flex :gap="8">
      <sue-time-picker variant="underlined" placeholder="Underlined" />
      <sue-time-range-picker variant="underlined" :placeholder="['Underlined Start', 'Underlined End']" />
    </sue-flex>
  </sue-flex>
</template>
```
