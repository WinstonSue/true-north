# Placement

## Description (en-US)

There are 12 `placement` options available. Set `arrow` with `pointAtCenter: true` if you want the arrow to point at the center of target.

## Source

```vue
<script setup lang="ts">
const title = 'Are you sure to delete this task?'
const description = 'Delete the task'
const buttonWidth = 80
</script>

<template>
  <sue-config-provider :button="{ style: { width: `${buttonWidth}px`, margin: '4px' } }">
    <sue-flex vertical justify="center" align="center" class="demo">
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-popconfirm
          placement="topLeft"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <sue-button>TL</sue-button>
        </sue-popconfirm>
        <sue-popconfirm
          placement="top"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <sue-button>Top</sue-button>
        </sue-popconfirm>
        <sue-popconfirm
          placement="topRight"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <sue-button>TR</sue-button>
        </sue-popconfirm>
      </sue-flex>
      <sue-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <sue-flex align="center" vertical>
          <sue-popconfirm
            placement="leftTop"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <sue-button>LT</sue-button>
          </sue-popconfirm>
          <sue-popconfirm
            placement="left"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <sue-button>Left</sue-button>
          </sue-popconfirm>
          <sue-popconfirm
            placement="leftBottom"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <sue-button>LB</sue-button>
          </sue-popconfirm>
        </sue-flex>
        <sue-flex align="center" vertical>
          <sue-popconfirm
            placement="rightTop"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <sue-button>RT</sue-button>
          </sue-popconfirm>
          <sue-popconfirm
            placement="right"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <sue-button>Right</sue-button>
          </sue-popconfirm>
          <sue-popconfirm
            placement="rightBottom"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <sue-button>RB</sue-button>
          </sue-popconfirm>
        </sue-flex>
      </sue-flex>
      <sue-flex justify="center" align="center" style="white-space: nowrap">
        <sue-popconfirm
          placement="bottomLeft"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <sue-button>BL</sue-button>
        </sue-popconfirm>
        <sue-popconfirm
          placement="bottom"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <sue-button>Bottom</sue-button>
        </sue-popconfirm>
        <sue-popconfirm
          placement="bottomRight"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <sue-button>BR</sue-button>
        </sue-popconfirm>
      </sue-flex>
    </sue-flex>
  </sue-config-provider>
</template>
```
