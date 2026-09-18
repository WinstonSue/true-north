# Color & Variant

## Description (en-US)

You can set the `color` and `variant` attributes at the same time can derive more variant buttons.

## Source

```vue
<script setup lang="ts">
import { useResponsive } from '@sue/design-web-vue'

const { xl } = useResponsive()
</script>

<template>
  <sue-config-provider :component-size="xl ? 'medium' : 'small'">
    <sue-flex vertical gap="small">
      <sue-flex gap="small" wrap>
        <sue-button color="default" variant="solid">
          Solid
        </sue-button>
        <sue-button color="default" variant="outlined">
          Outlined
        </sue-button>
        <sue-button color="default" variant="dashed">
          Dashed
        </sue-button>
        <sue-button color="default" variant="filled">
          Filled
        </sue-button>
        <sue-button color="default" variant="text">
          Text
        </sue-button>
        <sue-button color="default" variant="link">
          Link
        </sue-button>
      </sue-flex>
      <sue-flex gap="small" wrap>
        <sue-button color="primary" variant="solid">
          Solid
        </sue-button>
        <sue-button color="primary" variant="outlined">
          Outlined
        </sue-button>
        <sue-button color="primary" variant="dashed">
          Dashed
        </sue-button>
        <sue-button color="primary" variant="filled">
          Filled
        </sue-button>
        <sue-button color="primary" variant="text">
          Text
        </sue-button>
        <sue-button color="primary" variant="link">
          Link
        </sue-button>
      </sue-flex>
      <sue-flex gap="small" wrap>
        <sue-button color="danger" variant="solid">
          Solid
        </sue-button>
        <sue-button color="danger" variant="outlined">
          Outlined
        </sue-button>
        <sue-button color="danger" variant="dashed">
          Dashed
        </sue-button>
        <sue-button color="danger" variant="filled">
          Filled
        </sue-button>
        <sue-button color="danger" variant="text">
          Text
        </sue-button>
        <sue-button color="danger" variant="link">
          Link
        </sue-button>
      </sue-flex>
      <sue-flex gap="small" wrap>
        <sue-button color="magenta" variant="solid">
          Solid
        </sue-button>
        <sue-button color="magenta" variant="outlined">
          Outlined
        </sue-button>
        <sue-button color="magenta" variant="dashed">
          Dashed
        </sue-button>
        <sue-button color="magenta" variant="filled">
          Filled
        </sue-button>
        <sue-button color="magenta" variant="text">
          Text
        </sue-button>
        <sue-button color="magenta" variant="link">
          Link
        </sue-button>
      </sue-flex>
      <sue-flex gap="small" wrap>
        <sue-button color="purple" variant="solid">
          Solid
        </sue-button>
        <sue-button color="purple" variant="outlined">
          Outlined
        </sue-button>
        <sue-button color="purple" variant="dashed">
          Dashed
        </sue-button>
        <sue-button color="purple" variant="filled">
          Filled
        </sue-button>
        <sue-button color="purple" variant="text">
          Text
        </sue-button>
        <sue-button color="purple" variant="link">
          Link
        </sue-button>
      </sue-flex>
      <sue-flex gap="small" wrap>
        <sue-button color="cyan" variant="solid">
          Solid
        </sue-button>
        <sue-button color="cyan" variant="outlined">
          Outlined
        </sue-button>
        <sue-button color="cyan" variant="dashed">
          Dashed
        </sue-button>
        <sue-button color="cyan" variant="filled">
          Filled
        </sue-button>
        <sue-button color="cyan" variant="text">
          Text
        </sue-button>
        <sue-button color="cyan" variant="link">
          Link
        </sue-button>
      </sue-flex>
    </sue-flex>
  </sue-config-provider>
</template>

<style scoped>

</style>
```
