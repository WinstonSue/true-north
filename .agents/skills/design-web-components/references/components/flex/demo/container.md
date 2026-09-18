# container

## Description (en-US)

Use `container` to control the size and flex behavior of the Flex root container.

## Source

```vue
<template>
  <sue-flex vertical gap="middle">
    <sue-flex gap="middle" class="demo-flex-shell">
      <sue-flex container="fixed" align="center" justify="center" class="demo-flex-panel demo-flex-fixed">
        fixed
      </sue-flex>
      <sue-flex container="fill" align="center" justify="center" class="demo-flex-panel demo-flex-fill">
        fill
      </sue-flex>
    </sue-flex>

    <div class="demo-flex-outer">
      <sue-flex container="full" align="center" justify="center" class="demo-flex-panel demo-flex-full">
        full
      </sue-flex>
    </div>
  </sue-flex>
</template>

<style scoped>
.demo-flex-shell {
  height: 96px;
  padding: 8px;
  border: 1px solid #d9d9d9;
}

.demo-flex-outer {
  width: 100%;
  height: 96px;
  padding: 8px;
  border: 1px dashed #91caff;
}

.demo-flex-panel {
  padding: 12px;
  border: 1px solid #91caff;
  border-radius: 6px;
  background: #e6f4ff;
}

.demo-flex-fixed {
  width: 120px;
  background: #fff7e6;
  border-color: #ffd591;
}

.demo-flex-fill {
  background: #e6f4ff;
}

.demo-flex-full {
  background: #f6ffed;
  border-color: #b7eb8f;
}
</style>
```
