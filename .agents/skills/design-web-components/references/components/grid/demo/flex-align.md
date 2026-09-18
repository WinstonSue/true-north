# Alignment

## Description (en-US)

Child elements vertically aligned.

## Source

```vue
<template>
  <sue-divider title-placement="left">
    Align Top
  </sue-divider>
  <sue-row justify="center" align="top" class="row-demo">
    <sue-col :span="4">
      <div class="demo-box height-100">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-50">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-120">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-80">
        col-4
      </div>
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    Align Middle
  </sue-divider>
  <sue-row justify="space-around" align="middle" class="row-demo">
    <sue-col :span="4">
      <div class="demo-box height-100">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-50">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-120">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-80">
        col-4
      </div>
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    Align Bottom
  </sue-divider>
  <sue-row justify="space-between" align="bottom" class="row-demo">
    <sue-col :span="4">
      <div class="demo-box height-100">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-50">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-120">
        col-4
      </div>
    </sue-col>
    <sue-col :span="4">
      <div class="demo-box height-80">
        col-4
      </div>
    </sue-col>
  </sue-row>
</template>

<style scoped>
.row-demo {
  padding: 8px 0;
  background: rgba(128, 128, 128, 0.08);
}
.height-50 {
  height: 50px;
  line-height: 50px;
}
.height-80 {
  height: 80px;
  line-height: 80px;
}
.height-100 {
  height: 100px;
  line-height: 100px;
}
.height-120 {
  height: 120px;
  line-height: 120px;
}
</style>
```
