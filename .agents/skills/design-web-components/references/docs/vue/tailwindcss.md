---
title: Tailwind CSS
---

Before anything else, wrap the `App.vue` entry with `sue-app` so the runtime has a parent style container:

```vue
<template>
  <sue-app>
    <router-view />
  </sue-app>
</template>
```

This plugin maps Ant Design CSS variables into Tailwind's theme system, so utilities like `bg-primary`, `shadow-card`, and `text-h1` can still follow `@sue/design-web-vue` runtime theming.

## Version Compatibility

`@@sue/design-web-vue/tailwind` ships in lockstep with `@sue/design-web-vue`. Pick the matching version from the table below:

| `@sue/design-web-vue` | `@@sue/design-web-vue/tailwind` | Notes |
| --- | --- | --- |
| `>=1.3.0` | `^1.1.0` | **Current recommended.** Spacing tokens are aligned with antdv 1.3.0 (`p-xxl`, `p-xxxl`, `m-xxxl` are removed) and many new semantic tokens are added (`primary-text`, `success-bg-hover`, `text-placeholder`, `bg-solid`, …). Also introduces the v4 namespace-safe entry `compat.css`. |
| `<1.3.0` | `<1.1.0` | antdv before 1.3.0 still exposes the old spacing tokens. Pinning `@@sue/design-web-vue/tailwind@<1.1.0` avoids referencing variables that no longer exist. |

> When you bump `@sue/design-web-vue` to 1.3.0, bump `@@sue/design-web-vue/tailwind` to `>=1.1.0` together. If you are still on @sue/design-web-vue 1.2.x or earlier, pin `@@sue/design-web-vue/tailwind` to the 1.0.x line.

## Package Info

- Package: `@@sue/design-web-vue/tailwind`
- `peerDependencies`: `tailwindcss >= 3.0.0`

## Installation

For @sue/design-web-vue 1.3.0+:

```bash
pnpm add -D tailwindcss @@sue/design-web-vue/tailwind@^1.1.0
```

For @sue/design-web-vue 1.2.x and earlier:

```bash
pnpm add -D tailwindcss @@sue/design-web-vue/tailwind@~1.0
```

## When to use it

This package is a good fit when:

- your project already uses Tailwind CSS
- you want to keep the Tailwind workflow while integrating `@sue/design-web-vue` theme variables
- you need runtime theme switching instead of fixed build-time colors

If you prefer an UnoCSS-based approach, see the [UnoCSS](unocss.md) guide.

## Tailwind CSS v4 (Recommended)

Tailwind CSS v4 wires the theme through the `@theme` mechanism. Starting from 1.1.0, `@@sue/design-web-vue/tailwind` ships **two parallel entries**:

| Entry | Utility example | When to use |
| --- | --- | --- |
| `theme.css` (classic) | `bg-primary`, `p-lg`, `text-lg`, `shadow-card` | Existing projects; accept antdv tokens occupying Tailwind's native utility namespace |
| `compat.css` (**recommended**) | `bg-sue-primary`, `p-sue-lg`, `text-sue-lg`, `shadow-sue-card` (plus optional `sue-bg-primary` etc. shortcuts) | New projects; avoid clashes with Tailwind built-in tokens or project-level custom tokens |

> For the design rationale, see [css-plugin Issue #7 (RFC)].

### Option 1: Import the theme file directly

```css
@import "tailwindcss";

/* Pick one — classic entry */
@import "@@sue/design-web-vue/tailwind/theme.css";

/* Or — namespace-safe entry (recommended) */
@import "@@sue/design-web-vue/tailwind/compat.css";
```

### Option 2: Generate theme CSS dynamically

If you need a custom CSS variable prefix or namespace, use the generators exported from the `v4` entry:

```ts
import {
  generateCompatThemeCSS,
  generateThemeCSS,
} from '@@sue/design-web-vue/tailwind/v4'

// Classic entry (default antPrefix='sue')
const css = generateThemeCSS({
  antPrefix: 'my-app',
})

// Namespace-safe entry
const compatCss = generateCompatThemeCSS({
  antPrefix: 'sue',              // @sue/design-web-vue CSS variable prefix
  tokenPrefix: 'sue',            // produces --color-sue-primary, @utility p-sue-lg
  prefix: 'sue',                 // also emits @utility sue-bg-primary shortcuts
  allowPrefixedUtilities: true, // toggle the shortcuts above
})
```

### compat.css options

- `antPrefix`: the @sue/design-web-vue CSS variable prefix (must match your `ConfigProvider` `prefixCls`)
- `tokenPrefix`: namespace injected into every Tailwind v4 theme token, e.g. `--color-sue-primary`, `--padding-sue-lg`, `--text-sue-lg`. Also emits `@utility p-sue-lg { padding: var(--padding-sue-lg) }` style safe directional utilities so Tailwind's native `p-*` is not overridden
- `prefix`: extra prefixed utility shortcuts (e.g. `sue-bg-primary`, `sue-p-lg`) bound directly to antdv variables — they do not depend on `tokenPrefix`
- `allowPrefixedUtilities`: toggle the prefixed shortcuts. Disable it to keep only the namespaced tokens in `@theme inline`

## Tailwind CSS v3

If you are still on Tailwind CSS v3, use the plugin form.

### Basic setup

```ts
import antdPlugin from '@@sue/design-web-vue/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [antdPlugin],
}
```

### Custom setup

```ts
import { createAntdPlugin } from '@@sue/design-web-vue/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [
    createAntdPlugin({
      antPrefix: 'sue',
    }),
  ],
}
```

## Usage Example

```vue
<template>
  <!-- Classic theme.css writing -->
  <div class="bg-primary text-white p-lg rounded-lg shadow-card">
    <h1 class="text-h1 text-primary">Classic theme.css</h1>
    <p class="text-text-secondary mt-sm">
      Tailwind utilities powered by Ant Design theme variables
    </p>
  </div>

  <!-- compat.css recommended writing (namespace-safe) -->
  <div class="bg-sue-primary text-sue-light-solid p-sue-lg rounded-sue-lg shadow-sue-card">
    <h1 class="text-sue-h1 color-sue-primary">Namespace safe</h1>
    <p class="color-sue-text-secondary mt-sue-sm">
      Doesn't collide with Tailwind built-in tokens
    </p>
  </div>

  <!-- compat.css also emits sue-* prefixed shortcuts -->
  <div class="sue-bg-primary sue-color-white sue-p-lg sue-rounded-lg sue-shadow-card">
    <h1 class="sue-text-h1">Prefixed shortcut</h1>
  </div>
</template>
```

## Tailwind v4 Utility Mapping

| Category | Classic `theme.css` | Recommended `compat.css` | Shortcut |
| --- | --- | --- | --- |
| Color | `bg-primary`, `text-blue-5` | `bg-sue-primary`, `text-sue-blue-5` | `sue-bg-primary`, `sue-c-primary` |
| Padding | `p-lg`, `px-sm` | `p-sue-lg`, `px-sue-sm` | `sue-p-lg`, `sue-px-sm` |
| Margin | `m-lg`, `my-sm` | `m-sue-lg`, `my-sue-sm` | `sue-m-lg`, `sue-my-sm` |
| Radius | `rounded-lg` | `rounded-sue-lg` | `sue-rounded-lg`, `sue-rd-lg` |
| Font size | `text-h1` | `text-sue-h1` | `sue-text-h1` |
| Shadow | `shadow-card` | `shadow-sue-card` | `sue-shadow-card` |

## Common Utility Reference

### Colors and Backgrounds

| Classic `theme.css` | Namespace-safe `compat.css` | Description |
| --- | --- | --- |
| `bg-primary` | `bg-sue-primary` | Primary background color |
| `text-primary` | `color-sue-primary` | Primary text color |
| `bg-success` | `bg-sue-success` | Success background color |
| `text-text-secondary` | `color-sue-text-secondary` | Secondary text color |
| `bg-container` | `bg-sue-container` | Container background color |
| `border-border` | `border-sue-border` | Default border color |

### Spacing and Layout

| Classic | Namespace-safe | Description |
| --- | --- | --- |
| `p-lg` | `p-sue-lg` | Large padding |
| `px-md` | `px-sue-md` | Medium horizontal padding |
| `py-sm` | `py-sue-sm` | Small vertical padding |
| `m-md` | `m-sue-md` | Medium margin |
| `mt-sm` | `mt-sue-sm` | Small top margin |
| `rounded-lg` | `rounded-sue-lg` | Large border radius |

### Typography and Shadows

| Classic | Namespace-safe | Description |
| --- | --- | --- |
| `text-h1` | `text-sue-h1` | H1 title size |
| `text-lg` | `text-sue-lg` | Large text |
| `text-sm` | `text-sue-sm` | Small text |
| `shadow-card` | `shadow-sue-card` | Card shadow |
| `shadow-sec` | `shadow-sue-sec` | Secondary shadow |
| `shadow-ter` | `shadow-sue-ter` | Tertiary shadow |

## Spacing Tokens (aligned with antdv 1.3.0)

- Padding: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`
- Margin: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

> Starting from 1.1.0, `p-xxl`, `p-xxxl`, and `m-xxxl` are no longer generated because antdv 1.3.0 removed the underlying CSS variables. If you are still on @sue/design-web-vue 1.2.x or earlier, pin `@@sue/design-web-vue/tailwind` to the 1.0.x line.

## New Tokens Added in 1.3.0 (available since 1.1.0)

The semantic token set is now fully aligned with antdv 1.3.0:

- Primary / Success / Warning / Error / Info each provide ten steps: `*-bg`, `*-bg-hover`, `*-border`, `*-border-hover`, `*-hover`, `*`, `*-active`, `*-text`, `*-text-hover`, `*-text-active`
- Error extras: `error-bg-filled-hover`, `error-bg-active`, `error-affix`
- Warning extras: `warning-affix`
- Text: `text-placeholder`, `text-disabled`, `text-heading`, `text-label`, `text-description`, `text-light-solid`
- Fill: `fill-content`, `fill-content-hover`, `fill-alter`
- Background: `container-disabled`, `spotlight`, `blur`, `solid`, `solid-hover`, `solid-active`
- Border: `border-disabled`, `border-bg`
- Icon: `icon`, `icon-hover`
- Misc: `highlight`, `white`

## Relation to Theming

```vue
<script setup lang="ts">
import { ConfigProvider } from '@sue/design-web-vue'
</script>

<template>
  <ConfigProvider>
    <RouterView />
  </ConfigProvider>
</template>
```

## Notes

- For v4 the recommended path is importing `compat.css`: namespace-safe, no collisions with Tailwind built-in utilities. You can keep `theme.css` for existing projects.
- Starting from 1.1.0, `theme.css` no longer emits `p-xxl` / `p-xxxl` / `m-xxxl` so it stays consistent with antdv 1.3.0's actual CSS variables.
- Both v3 and v4 keep Tailwind global spacing behavior intact, so classes like `gap-*` and `max-w-*` still follow Tailwind defaults.
- If you change the CSS variable prefix, keep `antPrefix` aligned in the plugin / generator config.
- `compat.css`'s namespace defaults to `sue` (i.e. `bg-sue-primary`). Override it via `generateCompatThemeCSS({ tokenPrefix: 'yds' })` to get `bg-yds-primary` style utilities.
