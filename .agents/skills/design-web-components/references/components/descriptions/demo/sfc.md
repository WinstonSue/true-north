# SFC Mode

## Description (en-US)

Support SFC mode with full `items` + `contentRender` case.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <sue-descriptions title="User Info" bordered>
    <sue-descriptions-item label="Product">
      Cloud Database
    </sue-descriptions-item>
    <sue-descriptions-item label="Billing Mode">
      Prepaid
    </sue-descriptions-item>
    <sue-descriptions-item label="Automatic Renewal">
      YES
    </sue-descriptions-item>
    <sue-descriptions-item label="Order time">
      2018-04-24 18:00:00
    </sue-descriptions-item>
    <sue-descriptions-item label="Usage Time" :span="2">
      2019-04-24 18:00:00
    </sue-descriptions-item>
    <sue-descriptions-item label="Status" :span="3">
      <sue-badge status="processing" text="running" />
    </sue-descriptions-item>
    <sue-descriptions-item label="Negotiated Amount">
      $80.00
    </sue-descriptions-item>
    <sue-descriptions-item label="Discount">
      $20.00
    </sue-descriptions-item>
    <sue-descriptions-item label="Official Receipts">
      $60.00
    </sue-descriptions-item>
    <sue-descriptions-item label="Config Info">
      Data disk type: MongoDB
      <br>
      Database version: 3.4
      <br>
      Package: dds.mongo.mid
      <br>
      Storage space: 10 GB
      <br>
      Replication factor: 3
      <br>
      Region: East China 1
      <br>
    </sue-descriptions-item>
  </sue-descriptions>
</template>
```
