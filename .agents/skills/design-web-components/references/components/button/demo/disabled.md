# Disabled

## Description (en-US)

To mark a button as disabled, add the `disabled` property to the `Button`.

## Source

```vue
<template>
  <sue-flex gap="small" align="flex-start" vertical>
    <sue-flex gap="small">
      <sue-button type="primary">
        Primary
      </sue-button>
      <sue-button type="primary" disabled>
        Primary(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button>Default</sue-button>
      <sue-button disabled>
        Default(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button type="dashed">
        Dashed
      </sue-button>
      <sue-button type="dashed" disabled>
        Dashed(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button type="text">
        Text
      </sue-button>
      <sue-button type="text" disabled>
        Text(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button type="link">
        Link
      </sue-button>
      <sue-button type="link" disabled>
        Link(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button type="primary" href="https://@sue/design-web-vue.com/index-cn">
        Href Primary
      </sue-button>
      <sue-button type="primary" href="https://@sue/design-web-vue.com/index-cn" disabled>
        Href Primary(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button danger>
        Danger Default
      </sue-button>
      <sue-button danger disabled>
        Danger Default(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button danger type="text">
        Danger Text
      </sue-button>
      <sue-button danger type="text" disabled>
        Danger Text(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small">
      <sue-button type="link" danger>
        Danger Link
      </sue-button>
      <sue-button type="link" danger disabled>
        Danger Link(disabled)
      </sue-button>
    </sue-flex>
    <sue-flex gap="small" class="site-button-ghost-wrapper">
      <sue-button ghost>
        Ghost
      </sue-button>
      <sue-button ghost disabled>
        Ghost(disabled)
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
