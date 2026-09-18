# prefix and suffix

## Description (en-US)

Add a prefix or suffix icons inside input.

## Source

```vue
<script setup lang="ts">
import { Info, Lock, User } from '@lucide/vue'
</script>

<template>
  <div>
    <sue-input placeholder="Enter your username">
      <template #prefix>
        <User style="color: rgba(0, 0, 0, 0.25);" />
      </template>
      <template #suffix>
        <sue-tooltip title="Extra information">
          <Info style="color: rgba(0, 0, 0, 0.45);" />
        </sue-tooltip>
      </template>
    </sue-input>
    <br>
    <br>
    <sue-input prefix="￥" suffix="RMB" />
    <br>
    <br>
    <sue-input prefix="￥" suffix="RMB" disabled />
    <br>
    <br>
    <sue-input-password placeholder="input password support suffix">
      <template #suffix>
        <Lock />
      </template>
    </sue-input-password>
  </div>
</template>
```
