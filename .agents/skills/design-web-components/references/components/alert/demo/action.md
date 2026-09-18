# Custom action

## Description (en-US)

Custom action.

## Source

```vue
<template>
  <sue-alert
    title="Success Tips"
    type="success"
    show-icon
    closable
  >
    <template #action>
      <sue-button type="text" size="small">
        UNDO
      </sue-button>
    </template>
  </sue-alert>
  <br>
  <sue-alert
    title="Error Text"
    show-icon
    description="Error Description Error Description Error Description Error Description"
    type="error"
  >
    <template #action>
      <sue-button size="small" danger>
        Detail
      </sue-button>
    </template>
  </sue-alert>
  <br>
  <sue-alert
    title="Warning Text"
    type="warning"
    closable
  >
    <template #action>
      <sue-space>
        <sue-button size="small" type="text">
          Done
        </sue-button>
      </sue-space>
    </template>
  </sue-alert>
  <br>
  <sue-alert
    title="Info Text"
    description="Info Description Info Description Info Description Info Description"
    type="info"
    closable
  >
    <template #action>
      <sue-space direction="vertical">
        <sue-button size="small" type="primary">
          Accept
        </sue-button>
        <sue-button size="small" danger ghost>
          Decline
        </sue-button>
      </sue-space>
    </template>
  </sue-alert>
</template>
```
