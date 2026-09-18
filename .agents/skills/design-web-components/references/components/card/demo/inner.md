# Inner card

## Description (en-US)

It can be placed inside the ordinary card to display the information of the multilevel structure.

## Source

```vue
<template>
  <sue-card title="Card title">
    <sue-card type="inner" title="Inner Card title">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </sue-card>
    <sue-card style="margin-top: 16px" type="inner" title="Inner Card title">
      <template #extra>
        <a href="#">More</a>
      </template>
      Inner Card content
    </sue-card>
  </sue-card>
</template>
```
