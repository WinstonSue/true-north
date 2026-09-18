# Custom Icon

## Description (en-US)

A relevant icon makes information clearer and more friendly.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import { h } from 'vue'

const icon = () => h(Smile)
</script>

<template>
  <sue-alert :icon="icon" title="showIcon = false" type="success" />
  <br>
  <sue-alert :icon="icon" title="Success Tips" type="success" show-icon />
  <br>
  <sue-alert :icon="icon" title="Informational Notes" type="info" show-icon />
  <br>
  <sue-alert :icon="icon" title="Warning" type="warning" show-icon />
  <br>
  <sue-alert :icon="icon" title="Error" type="error" show-icon />
  <br>
  <sue-alert
    :icon="icon"
    title="Success Tips"
    description="Detailed description and advice about successful copywriting."
    type="success"
    show-icon
  />
  <br>
  <sue-alert
    :icon="icon"
    title="Informational Notes"
    description="Additional description and information about copywriting."
    type="info"
    show-icon
  />
  <br>
  <sue-alert
    :icon="icon"
    title="Warning"
    description="This is a warning notice about copywriting."
    type="warning"
    show-icon
  />
  <br>
  <sue-alert
    :icon="icon"
    title="Error"
    description="This is an error message about copywriting."
    type="error"
    show-icon
  />
</template>
```
