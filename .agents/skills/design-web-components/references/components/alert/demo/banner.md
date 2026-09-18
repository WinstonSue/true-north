# Banner

## Description (en-US)

Display Alert as a banner at top of page.

## Source

```vue
<template>
  <sue-alert title="Warning text" banner />
  <br>
  <sue-alert
    title="Very long warning text warning text text text text text text text"
    banner
    closable
  />
  <br>
  <sue-alert :show-icon="false" title="Warning text without icon" banner />
  <br>
  <sue-alert type="error" title="Error text" banner />
</template>
```
