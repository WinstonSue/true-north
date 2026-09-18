# Solid radio button

## Description (en-US)

Solid radio button style.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef('a')
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-radio-group v-model:value="value" button-style="solid">
      <sue-radio-button value="a">
        Hangzhou
      </sue-radio-button>
      <sue-radio-button value="b">
        Shanghai
      </sue-radio-button>
      <sue-radio-button value="c">
        Beijing
      </sue-radio-button>
      <sue-radio-button value="d">
        Chengdu
      </sue-radio-button>
    </sue-radio-group>
    <sue-radio-group v-model:value="value" button-style="solid">
      <sue-radio-button value="a">
        Hangzhou
      </sue-radio-button>
      <sue-radio-button value="b" disabled>
        Shanghai
      </sue-radio-button>
      <sue-radio-button value="c">
        Beijing
      </sue-radio-button>
      <sue-radio-button value="d">
        Chengdu
      </sue-radio-button>
    </sue-radio-group>
  </sue-flex>
</template>
```
