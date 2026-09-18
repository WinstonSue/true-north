# Multiple Buttons

## Description (en-US)

If you need several buttons, we recommend that you use 1 primary button + n secondary buttons. If there are more than three operations, you can group some of them into a [Dropdown](../../dropdown/docs.md/#dropdown-demo-dropdown-button).

## Source

```vue
<script setup lang="ts">
import type { MenuEmits } from '@sue/design-web-vue'
import { Ellipsis } from '@lucide/vue'

const onMenuClick: MenuEmits['click'] = (e) => {
  console.log('click', e)
}

const items = [
  {
    key: '1',
    label: '1st item',
  },
  {
    key: '2',
    label: '2nd item',
  },
  {
    key: '3',
    label: '3rd item',
  },
]
</script>

<template>
  <sue-flex align="flex-start" gap="small" vertical>
    <sue-button type="primary">
      primary
    </sue-button>
    <sue-button>secondary</sue-button>
    <sue-space-compact>
      <sue-button>Actions</sue-button>
      <sue-dropdown :menu="{ items, onClick: onMenuClick }" placement="bottomRight">
        <sue-button>
          <template #icon>
            <Ellipsis />
          </template>
        </sue-button>
      </sue-dropdown>
    </sue-space-compact>
  </sue-flex>
</template>
```
