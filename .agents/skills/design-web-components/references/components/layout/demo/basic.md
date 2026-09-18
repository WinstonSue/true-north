# Basic Structure

## Description (en-US)

Classic page layouts.

## Source

```vue
<template>
  <sue-flex gap="middle" wrap>
    <sue-layout class="demo-layout">
      <sue-layout-header class="demo-header">
        Header
      </sue-layout-header>
      <sue-layout-content class="demo-content">
        Content
      </sue-layout-content>
      <sue-layout-footer class="demo-footer">
        Footer
      </sue-layout-footer>
    </sue-layout>

    <sue-layout class="demo-layout">
      <sue-layout-header class="demo-header">
        Header
      </sue-layout-header>
      <sue-layout>
        <sue-layout-sider width="25%" class="demo-sider">
          Sider
        </sue-layout-sider>
        <sue-layout-content class="demo-content">
          Content
        </sue-layout-content>
      </sue-layout>
      <sue-layout-footer class="demo-footer">
        Footer
      </sue-layout-footer>
    </sue-layout>

    <sue-layout class="demo-layout">
      <sue-layout-header class="demo-header">
        Header
      </sue-layout-header>
      <sue-layout>
        <sue-layout-content class="demo-content">
          Content
        </sue-layout-content>
        <sue-layout-sider width="25%" class="demo-sider">
          Sider
        </sue-layout-sider>
      </sue-layout>
      <sue-layout-footer class="demo-footer">
        Footer
      </sue-layout-footer>
    </sue-layout>

    <sue-layout class="demo-layout">
      <sue-layout-sider width="25%" class="demo-sider">
        Sider
      </sue-layout-sider>
      <sue-layout>
        <sue-layout-header class="demo-header">
          Header
        </sue-layout-header>
        <sue-layout-content class="demo-content">
          Content
        </sue-layout-content>
        <sue-layout-footer class="demo-footer">
          Footer
        </sue-layout-footer>
      </sue-layout>
    </sue-layout>
  </sue-flex>
</template>

<style scoped>
.demo-layout {
  border-radius: 8px;
  overflow: hidden;
  width: calc(50% - 8px);
  max-width: calc(50% - 8px);
}

.demo-header {
  text-align: center;
  color: #fff;
  height: 64px;
  padding-inline: 48px;
  line-height: 64px;
  background-color: #4096ff;
}

.demo-content {
  text-align: center;
  min-height: 120px;
  line-height: 120px;
  color: #fff;
  background-color: #0958d9;
}

.demo-sider {
  text-align: center;
  line-height: 120px;
  color: #fff;
  background-color: #1677ff;
}

.demo-footer {
  text-align: center;
  color: #fff;
  background-color: #4096ff;
}
</style>
```
