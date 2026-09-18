# Button Compact Mode

## Description (en-US)

Compact button group.

## Source

```vue
<script setup lang="ts">
import { MessageSquare, Download, Ellipsis, Heart, Link, Mail, Smartphone, Share2, Star, TriangleAlert } from '@lucide/vue'
import { h } from 'vue'
</script>

<template>
  <sue-space-compact block>
    <sue-tooltip title="Link">
      <sue-button>
        <template #icon>
          <Link />
        </template>
      </sue-button>
    </sue-tooltip>
    <sue-tooltip title="Comment">
      <sue-button>
        <template #icon>
          <MessageSquare />
        </template>
      </sue-button>
    </sue-tooltip>
    <sue-tooltip title="Star">
      <sue-button>
        <template #icon>
          <Star />
        </template>
      </sue-button>
    </sue-tooltip>
    <sue-tooltip title="Heart">
      <sue-button>
        <template #icon>
          <Heart />
        </template>
      </sue-button>
    </sue-tooltip>
    <sue-tooltip title="Share">
      <sue-button>
        <template #icon>
          <Share2 />
        </template>
      </sue-button>
    </sue-tooltip>
    <sue-tooltip title="Download">
      <sue-button>
        <template #icon>
          <Download />
        </template>
      </sue-button>
    </sue-tooltip>

    <sue-dropdown
      placement="bottomRight" :menu="{
        items: [
          {
            key: '1',
            label: 'Report',
            icon: () => h(TriangleAlert),
          },
          {
            key: '2',
            label: 'Mail',
            icon: () => h(Mail),
          },
          {
            key: '3',
            label: 'Mobile',
            icon: () => h(Smartphone),
          },
        ],
        onClick: () => console.log('click dropdown'),
      }
      " :trigger="['click']"
    >
      <sue-button>
        <template #icon>
          <Ellipsis />
        </template>
      </sue-button>
    </sue-dropdown>
  </sue-space-compact>

  <br>

  <sue-space-compact block>
    <sue-button type="primary">
      Button 1
    </sue-button>
    <sue-button type="primary">
      Button 2
    </sue-button>
    <sue-button type="primary">
      Button 3
    </sue-button>
    <sue-button type="primary">
      Button 4
    </sue-button>
    <sue-tooltip title="Tooltip">
      <sue-button type="primary" disabled>
        <Download />
      </sue-button>
    </sue-tooltip>
    <sue-tooltip type="primary" title="Tooltip">
      <sue-button>
        <Download />
      </sue-button>
    </sue-tooltip>
  </sue-space-compact>

  <br>

  <sue-space-compact block>
    <sue-button type="primary">
      Button 1
    </sue-button>
    <sue-button type="primary">
      Button 2
    </sue-button>
    <sue-button type="primary">
      Button 3
    </sue-button>
    <sue-tooltip title="Tooltip">
      <sue-button type="primary" disabled>
        <Download />
      </sue-button>
    </sue-tooltip>
    <sue-tooltip type="primary" title="Tooltip">
      <sue-button>
        <Download />
      </sue-button>
    </sue-tooltip>
    <sue-button type="primary">
      Button 4
    </sue-button>

    <sue-dropdown
      placement="bottomRight" :menu="{
        items: [
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
        ],
        onClick: () => console.log('click dropdown'),
      }
      " :trigger="['click']"
    >
      <sue-button type="primary">
        <template #icon>
          <Ellipsis />
        </template>
      </sue-button>
    </sue-dropdown>
  </sue-space-compact>
</template>
```
