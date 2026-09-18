# Customized description

## Description (en-US)

Customize the description text.

## Source

```vue
<template>
  <sue-flex gap="middle" vertical>
    <sue-flex gap="middle">
      <sue-spin tip="Loading" size="small">
        <div style="padding: 50px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;" />
      </sue-spin>
      <sue-spin tip="Loading">
        <div style="padding: 50px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;" />
      </sue-spin>
      <sue-spin tip="Loading" size="large">
        <div style="padding: 50px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;" />
      </sue-spin>
    </sue-flex>
    <sue-spin tip="Loading...">
      <sue-alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </sue-spin>
  </sue-flex>
</template>
```
