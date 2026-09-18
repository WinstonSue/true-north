# Grid Gutter

## Description (en-US)

You can use the `gutter` property of `Row` as grid spacing. We recommend `(16 + 8n)px` (`n` stands for natural number).

For responsive spacing, set it as an object like `{ xs: 8, sm: 16, md: 24, lg: 32 }`.

For vertical spacing, use an array `[horizontal, vertical]`.

## Source

```vue
<template>
  <sue-divider title-placement="left">
    Horizontal
  </sue-divider>
  <sue-row :gutter="16">
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    Responsive
  </sue-divider>
  <sue-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
  </sue-row>

  <sue-divider title-placement="left">
    Vertical
  </sue-divider>
  <sue-row :gutter="[16, 24]">
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
    <sue-col :span="6" class="gutter-row">
      <div class="gutter-box">
        col-6
      </div>
    </sue-col>
  </sue-row>
</template>

<style scoped>
.gutter-box {
  padding: 8px 0;
  color: #fff;
  text-align: center;
  background: #0092ff;
}
</style>
```
