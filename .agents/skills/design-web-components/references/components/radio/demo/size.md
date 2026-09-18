# Size

## Description (en-US)

There are three sizes available: large, medium, and small. It can coordinate with input box.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef()
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-radio-group v-model:value="value" size="small" default-value="a">
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
    <sue-radio-group v-model:value="value" default-value="a">
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
    <sue-radio-group v-model:value="value" size="large" disabled default-value="a">
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
  </sue-flex>
</template>
```
