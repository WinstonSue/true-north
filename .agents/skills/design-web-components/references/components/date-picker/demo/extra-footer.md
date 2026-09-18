# Extra Footer

## Description (en-US)

Render extra footer in panel for customized requirements.

## Source

```vue
<template>
  <sue-space vertical :size="12">
    <sue-date-picker>
      <template #renderExtraFooter>
        extra footer
      </template>
    </sue-date-picker>
    <sue-date-picker show-time>
      <template #renderExtraFooter>
        extra footer
      </template>
    </sue-date-picker>
    <sue-range-picker>
      <template #renderExtraFooter>
        extra footer
      </template>
    </sue-range-picker>
    <sue-range-picker show-time>
      <template #renderExtraFooter>
        extra footer
      </template>
    </sue-range-picker>
    <sue-date-picker picker="month">
      <template #renderExtraFooter>
        extra footer
      </template>
    </sue-date-picker>
  </sue-space>
</template>
```
