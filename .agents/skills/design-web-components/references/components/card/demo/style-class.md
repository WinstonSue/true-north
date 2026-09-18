# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { CardProps } from '@sue/design-web-vue'
import { Pencil, Heart, Share2 } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'
import { computed } from 'vue'

const { token } = theme.useToken()

const classes = computed(() => ({
  root: 'custom-card-root',
  header: 'custom-card-header',
  body: 'custom-card-body',
}))

const stylesCard = computed(() => ({
  root: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 500,
  },
}))

const stylesCardFn = computed(() => {
  return (info: { props: CardProps }) => {
    if (info.props.variant === 'outlined') {
      return {
        root: {
          borderColor: '#696FC7',
          boxShadow: '0 2px 8px #A7AAE1',
          borderRadius: '8px',
        },
        extra: {
          color: '#696FC7',
        },
        title: {
          fontSize: '16px',
          fontWeight: 500,
          color: '#A7AAE1',
        },
      }
    }
    return {}
  }
})

const stylesCardMeta = {
  title: {
    color: '#A7AAE1',
  },
  description: {
    color: '#A7AAE1',
  },
}
</script>

<template>
  <sue-flex gap="middle">
    <sue-card
      title="Object Card"
      :classes="classes"
      :styles="stylesCard"
      variant="borderless"
    >
      <template #extra>
        <sue-button type="link">
          More
        </sue-button>
      </template>
      <template #actions>
        <Heart key="heart" style="color: #ff6b6b" />
        <Share2 key="share" style="color: #4ecdc4" />
        <Pencil key="edit" style="color: #45b7d1" />
      </template>
      <sue-card-meta title="Object Card Meta title" description="This is the description">
        <template #avatar>
          <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </template>
      </sue-card-meta>
    </sue-card>
    <sue-card
      title="Function Card"
      :classes="classes"
      :styles="stylesCardFn"
    >
      <template #extra>
        <sue-button type="link" :styles="{ root: { color: '#A7AAE1' } }">
          More
        </sue-button>
      </template>
      <template #actions>
        <Heart key="heart" style="color: #ff6b6b" />
        <Share2 key="share" style="color: #4ecdc4" />
        <Pencil key="edit" style="color: #45b7d1" />
      </template>
      <sue-card-meta
        title="Function Card Meta title"
        description="This is the description"
        :styles="stylesCardMeta"
      >
        <template #avatar>
          <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </template>
      </sue-card-meta>
    </sue-card>
  </sue-flex>
</template>

<style scoped>
.custom-card-root {
  width: 300px;
  background-color: v-bind('token.colorBgContainer');
  border-radius: v-bind('`${token.borderRadiusLG}px`');
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid v-bind('token.colorBorderSecondary');
}

.custom-card-header {
  border-bottom: none;
  padding-bottom: 8px;
}

.custom-card-body {
  padding-top: 0;
}
</style>
```
