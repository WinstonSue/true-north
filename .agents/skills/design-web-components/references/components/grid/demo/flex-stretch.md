# Flex Stretch

## Description (en-US)

Col provides `flex` to support filling the rest space.

## Source

```vue
<template>
  <sue-divider title-placement="left">
    Percentage columns
  </sue-divider>
  <sue-row>
    <sue-col :flex="2" class="flex-col">
      2 / 5
    </sue-col>
    <sue-col :flex="3" class="flex-col">
      3 / 5
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    Fill rest
  </sue-divider>
  <sue-row>
    <sue-col flex="100px" class="flex-col">
      100px
    </sue-col>
    <sue-col flex="auto" class="flex-col">
      Fill Rest
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    Raw flex style
  </sue-divider>
  <sue-row>
    <sue-col flex="1 1 200px" class="flex-col">
      1 1 200px
    </sue-col>
    <sue-col flex="0 1 300px" class="flex-col">
      0 1 300px
    </sue-col>
  </sue-row>

  <sue-row :wrap="false">
    <sue-col flex="none" class="flex-col">
      <div class="flex-none">
        none
      </div>
    </sue-col>
    <sue-col flex="auto" class="flex-col">
      auto with no-wrap
    </sue-col>
  </sue-row>
</template>

<style scoped>
.flex-col {
  padding: 8px 0;
  color: #fff;
  text-align: center;
  background: #0092ff;
}
.flex-none {
  padding: 0 16px;
}
</style>
```
