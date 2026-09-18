# OTP

## Description (en-US)

One time password input.

## Source

```vue
<script setup lang="ts">
function onChange(text: string) {
  console.log('onChange:', text)
}

function onInput(value: string) {
  console.log('onInput:', value)
}
</script>

<template>
  <sue-flex gap="middle" align="flex-start" vertical>
    <sue-editable-text :level="5">
      With formatter (Upcase)
    </sue-editable-text>
    <sue-input-otp :formatter="(str: string) => str.toUpperCase()" @change="onChange" @input="onInput" />

    <sue-editable-text :level="5">
      With Disabled
    </sue-editable-text>
    <sue-input-otp disabled @change="onChange" @input="onInput" />

    <sue-editable-text :level="5">
      With Length (8)
    </sue-editable-text>
    <sue-input-otp :length="8" @change="onChange" @input="onInput" />

    <sue-editable-text :level="5">
      With variant
    </sue-editable-text>
    <sue-input-otp variant="filled" @change="onChange" @input="onInput" />

    <sue-editable-text :level="5">
      With custom display character
    </sue-editable-text>
    <sue-input-otp mask="🔒" @change="onChange" @input="onInput" />

    <sue-editable-text :level="5">
      With custom ReactNode separator
    </sue-editable-text>
    <sue-input-otp @change="onChange" @input="onInput">
      <template #separator>
        <span>/</span>
      </template>
    </sue-input-otp>

    <sue-editable-text :level="5">
      With custom function separator
    </sue-editable-text>
    <sue-input-otp @change="onChange" @input="onInput">
      <template #separator="{ index }">
        <span :style="{ color: index & 1 ? 'red' : 'blue' }">—</span>
      </template>
    </sue-input-otp>
  </sue-flex>
</template>
```
