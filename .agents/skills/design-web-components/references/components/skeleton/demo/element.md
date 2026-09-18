# Button/Avatar/Input/Image/Node

## Description (en-US)

Skeleton Button, Avatar, Input, Image and Node.

## Source

```vue
<script setup lang="ts">
import { ChartScatter } from '@lucide/vue'
import { ref } from 'vue'

type SizeType = 'large' | 'medium' | 'small'
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default'
type AvatarShapeType = 'circle' | 'square'

const active = ref(false)
const block = ref(false)
const size = ref<SizeType>('medium')
const buttonShape = ref<ButtonShapeType>('default')
const avatarShape = ref<AvatarShapeType>('circle')
</script>

<template>
  <sue-flex gap="medium" vertical>
    <sue-space>
      <sue-skeleton-button :active="active" :size="size" :shape="buttonShape" :block="block" />
      <sue-skeleton-avatar :active="active" :size="size" :shape="avatarShape" />
      <sue-skeleton-input :active="active" :size="size" />
    </sue-space>
    <sue-skeleton-button :active="active" :size="size" :shape="buttonShape" :block="block" />
    <sue-skeleton-input :active="active" :size="size" :block="block" />
    <sue-space>
      <sue-skeleton-image :active="active" />
      <sue-skeleton-node :active="active" style="width: 160px" />
      <sue-skeleton-node :active="active">
        <ChartScatter style="font-size: 40px; color: #bfbfbf" />
      </sue-skeleton-node>
    </sue-space>
    <sue-divider />
    <sue-form layout="inline" style="margin: 16px 0">
      <sue-space :size="16" wrap>
        <sue-form-item label="Active">
          <sue-switch v-model:value="active" />
        </sue-form-item>
        <sue-form-item label="Button and Input Block">
          <sue-switch v-model:value="block" />
        </sue-form-item>
        <sue-form-item label="Size">
          <sue-radio-group v-model:value="size">
            <sue-radio-button value="large">
              Large
            </sue-radio-button>
            <sue-radio-button value="medium">
              Medium
            </sue-radio-button>
            <sue-radio-button value="small">
              Small
            </sue-radio-button>
          </sue-radio-group>
        </sue-form-item>
        <sue-form-item label="Button Shape">
          <sue-radio-group v-model:value="buttonShape">
            <sue-radio-button value="default">
              Default
            </sue-radio-button>
            <sue-radio-button value="square">
              Square
            </sue-radio-button>
            <sue-radio-button value="round">
              Round
            </sue-radio-button>
            <sue-radio-button value="circle">
              Circle
            </sue-radio-button>
          </sue-radio-group>
        </sue-form-item>
        <sue-form-item label="Avatar Shape">
          <sue-radio-group v-model:value="avatarShape">
            <sue-radio-button value="square">
              Square
            </sue-radio-button>
            <sue-radio-button value="circle">
              Circle
            </sue-radio-button>
          </sue-radio-group>
        </sue-form-item>
      </sue-space>
    </sue-form>
  </sue-flex>
</template>
```
