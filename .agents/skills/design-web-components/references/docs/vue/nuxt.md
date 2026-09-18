---
title: Nuxt
---

`@sue/design-web-vue` can be used in Nuxt through a client plugin. This reference intentionally avoids a dedicated Nuxt module because this package does not expose one.

## Installation

```shell
pnpm add @sue/design-web-vue
```

## Plugin

Create a Nuxt plugin and install the component library on the Vue app.

```ts
// plugins/design-web.client.ts
import DesignWeb from '@sue/design-web-vue'
import '@sue/design-spec/reset.css'
import '@sue/design-web-vue/dist/sue.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DesignWeb)
})
```

## Usage

```vue
<template>
  <sue-button type="primary">Primary</sue-button>
</template>
```

Components are globally registered with the `sue-` tag prefix by default, for example `sue-button`, `sue-table`, and `sue-qrcode`.

For JSX/TSX files, prefer named imports:

```tsx
import { Button } from '@sue/design-web-vue'

export default () => <Button type="primary">Primary</Button>
```
