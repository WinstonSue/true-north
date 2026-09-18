# Customize character

## Description (en-US)

Can customize each character using `(RateProps) => ReactNode`.

## Source

```vue
<script lang="ts" setup>
import { Frown, Meh, Smile } from '@lucide/vue'
import { h, ref } from 'vue'

const customIcons: Record<number, any> = {
  1: h(Frown),
  2: h(Frown),
  3: h(Meh),
  4: h(Smile),
  5: h(Smile),
}
const value = ref(2)
const value2 = ref(3)
</script>

<template>
  <sue-flex gap="middle" vertical>
    <sue-rate v-model:value="value" :character="({ index = 0 }) => index + 1" />
    <sue-rate v-model:value="value2" :character="({ index = 0 }) => customIcons[index + 1]" />
  </sue-flex>
</template>
```
