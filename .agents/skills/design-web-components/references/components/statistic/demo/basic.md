# Basic

## Description (en-US)

Simplest Usage.

## Source

```vue
<template>
  <sue-row :gutter="16">
    <sue-col :span="12">
      <sue-statistic title="Active Users" :value="112893" />
    </sue-col>
    <sue-col :span="12">
      <sue-statistic title="Account Balance (CNY)" :value="112893" :precision="2" />
      <sue-button style="margin: 16px" type="primary">
        Recharge
      </sue-button>
    </sue-col>
    <sue-col :span="12">
      <sue-statistic title="Active Users" :value="112893" loading />
    </sue-col>
  </sue-row>
</template>
```
