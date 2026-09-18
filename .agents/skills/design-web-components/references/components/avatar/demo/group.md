# Avatar.Group

## Description (en-US)

Avatar group display.

## Source

```vue
<script setup lang="ts">
import { Hexagon, User } from '@lucide/vue'
</script>

<template>
  <div>
    <sue-avatar-group>
      <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
      <a href="https://ant.design">
        <sue-avatar style="background-color: #f56a00;">
          K
        </sue-avatar>
      </a>
      <sue-tooltip title="Ant User" placement="top">
        <sue-avatar style="background-color: #87d068;">
          <template #icon>
            <User />
          </template>
        </sue-avatar>
      </sue-tooltip>
      <sue-avatar style="background-color: #1677ff;">
        <template #icon>
          <Hexagon />
        </template>
      </sue-avatar>
    </sue-avatar-group>
    <sue-divider />
    <sue-avatar-group
      :max="{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }"
    >
      <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
      <sue-avatar style="background-color: #f56a00;">
        K
      </sue-avatar>
      <sue-tooltip title="Ant User" placement="top">
        <sue-avatar style="background-color: #87d068;">
          <template #icon>
            <User />
          </template>
        </sue-avatar>
      </sue-tooltip>
      <sue-avatar style="background-color: #1677ff;">
        <template #icon>
          <Hexagon />
        </template>
      </sue-avatar>
    </sue-avatar-group>
    <sue-divider />
    <sue-avatar-group
      size="large"
      :max="{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }"
    >
      <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
      <sue-avatar style="background-color: #f56a00;">
        K
      </sue-avatar>
      <sue-tooltip title="Ant User" placement="top">
        <sue-avatar style="background-color: #87d068;">
          <template #icon>
            <User />
          </template>
        </sue-avatar>
      </sue-tooltip>
      <sue-avatar style="background-color: #1677ff;">
        <template #icon>
          <Hexagon />
        </template>
      </sue-avatar>
    </sue-avatar-group>
    <sue-divider />
    <sue-avatar-group
      size="large"
      :max="{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' },
        popover: { trigger: 'click' },
      }"
    >
      <sue-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <sue-avatar style="background-color: #f56a00;">
        K
      </sue-avatar>
      <sue-tooltip title="Ant User" placement="top">
        <sue-avatar style="background-color: #87d068;">
          <template #icon>
            <User />
          </template>
        </sue-avatar>
      </sue-tooltip>
      <sue-avatar style="background-color: #1677ff;">
        <template #icon>
          <Hexagon />
        </template>
      </sue-avatar>
    </sue-avatar-group>
    <sue-divider />
    <sue-avatar-group shape="square">
      <sue-avatar style="background-color: #fde3cf;">
        A
      </sue-avatar>
      <sue-avatar style="background-color: #f56a00;">
        K
      </sue-avatar>
      <sue-avatar style="background-color: #87d068;">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar style="background-color: #1677ff;">
        <template #icon>
          <Hexagon />
        </template>
      </sue-avatar>
    </sue-avatar-group>
  </div>
</template>
```
