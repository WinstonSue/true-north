# Variants

## Description (en-US)

Variants of DatePicker, there are four variants: `outlined` `filled` `borderless` and `underlined`.

## Source

```vue
<template>
  <sue-flex vertical :gap="12">
    <sue-flex :gap="8">
      <sue-date-picker placeholder="Outlined" />
      <sue-range-picker :placeholder="['Outlined Start', 'Outlined End']" />
    </sue-flex>
    <sue-flex :gap="8">
      <sue-date-picker placeholder="Filled" variant="filled" />
      <sue-range-picker :placeholder="['Filled Start', 'Filled End']" variant="filled" />
    </sue-flex>
    <sue-flex :gap="8">
      <sue-date-picker placeholder="Borderless" variant="borderless" />
      <sue-range-picker :placeholder="['Borderless Start', 'Borderless End']" variant="borderless" />
    </sue-flex>
    <sue-flex :gap="8">
      <sue-date-picker placeholder="Underlined" variant="underlined" />
      <sue-range-picker :placeholder="['Underlined Start', 'Underlined End']" variant="underlined" />
    </sue-flex>
  </sue-flex>
</template>
```
