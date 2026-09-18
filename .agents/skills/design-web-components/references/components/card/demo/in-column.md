# Card in column

## Description (en-US)

Cards usually cooperate with grid column layout in overview page.

## Source

```vue
<template>
  <div class="w-full h-400px" style="background-color: rgb(240, 242, 245)">
    <sue-row :gutter="16">
      <sue-col :span="8">
        <sue-card title="Card title" variant="borderless">
          Card content
        </sue-card>
      </sue-col>
      <sue-col :span="8">
        <sue-card title="Card title" variant="borderless">
          Card content
        </sue-card>
      </sue-col>
      <sue-col :span="8">
        <sue-card title="Card title" variant="borderless">
          Card content
        </sue-card>
      </sue-col>
    </sue-row>
  </div>
</template>
```
