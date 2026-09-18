---
title: UnoCSS
---

Before anything else, wrap the `App.vue` entry with `sue-app` so the runtime has a parent style container:

```vue
<template>
  <sue-app>
    <router-view />
  </sue-app>
</template>
```

If you want to use atomic utility classes in an `@sue/design-web-vue` project and have those classes map directly to Ant Design CSS variables, use `@@sue/design-web-vue/unocss`.

## Version Compatibility

`@@sue/design-web-vue/unocss` ships in lockstep with `@sue/design-web-vue`. Pick the matching version from the table below:

| `@sue/design-web-vue` | `@@sue/design-web-vue/unocss` | Notes |
| --- | --- | --- |
| `>=1.3.0` | `^1.1.0` | **Current recommended.** Spacing tokens are aligned with antdv 1.3.0 (`p-xxl`, `p-xxxl`, `m-xxxl` are removed) and many new semantic tokens are added (`primary-text`, `success-bg-hover`, `text-placeholder`, `bg-solid`, …). Also introduces the namespace-safe mode (`bg-sue-primary`). |
| `<1.3.0` | `<1.1.0` | antdv before 1.3.0 still exposes the old spacing tokens. Pinning `@@sue/design-web-vue/unocss@<1.1.0` avoids generating utilities that point at variables which no longer exist. |

> When you bump `@sue/design-web-vue` to 1.3.0, bump `@@sue/design-web-vue/unocss` to `>=1.1.0` together. If you are still on @sue/design-web-vue 1.2.x or earlier, pin `@@sue/design-web-vue/unocss` to the 1.0.x line.

## Package Info

- Package: `@@sue/design-web-vue/unocss`
- `peerDependencies`: `unocss >= 66.0.0`

## Installation

For @sue/design-web-vue 1.3.0+:

```bash
pnpm add -D unocss @@sue/design-web-vue/unocss@^1.1.0
```

For @sue/design-web-vue 1.2.x and earlier:

```bash
pnpm add -D unocss @@sue/design-web-vue/unocss@~1.0
```

## When to use it

This package fits well when:

- you are already using UnoCSS
- you want to keep UnoCSS / Wind-style utility syntax
- you want colors, radius, shadows, and typography utilities to follow `@sue/design-web-vue` CSS variables
- you need runtime theme switching instead of build-time fixed values

If you are using Tailwind CSS, see the [Tailwind CSS](tailwindcss.md) guide.

## Available Presets

### `presetAntd`

The default preset. It follows the regular UnoCSS Wind3-style structure and works for most UnoCSS projects.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@@sue/design-web-vue/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'sue',                 // class prefix, default: 'sue'
      allowPrefixedUtilities: true, // keep sue-* utilities, default: true
      allowUnprefixed: true,        // keep legacy bare classes like bg-primary, default: true
      antPrefix: 'sue',              // CSS variable prefix, default: 'sue'
      tokenPrefix: 'sue',            // namespace prefix, default: 'sue' (empty disables)
    }),
  ],
})
```

Theme keys:

- `colors`
- `borderRadius`
- `fontSize`
- `boxShadow`

### `presetAntdTailwind4`

If you want to keep UnoCSS but prefer Tailwind CSS v4-style theme key naming, use this preset.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntdTailwind4 } from '@@sue/design-web-vue/unocss'

export default defineConfig({
  presets: [
    presetAntdTailwind4({
      prefix: 'sue',
      allowPrefixedUtilities: true,
      allowUnprefixed: true,
      antPrefix: 'sue',
      tokenPrefix: 'sue',
    }),
  ],
})
```

Theme keys:

- `colors`
- `radius`
- `text`
- `shadow`
- `defaults`

## Which one should you choose

### Choose `presetAntd`

- when you already have an UnoCSS setup
- when you want to keep the standard UnoCSS theme structure
- when you are combining it with presets like Wind3 or Attributify

### Choose `presetAntdTailwind4`

- when you prefer Tailwind CSS v4-style naming
- when you are migrating from Tailwind v4 to UnoCSS or mixing both approaches
- when you want theme keys such as `radius`, `shadow`, and `text`

## Three Utility Patterns (since 1.1.0)

Both presets emit three parallel utility forms that can be toggled independently:

| Mode | Example | Control | Use when |
| --- | --- | --- | --- |
| **Prefixed (stable)** | `sue-bg-primary`, `sue-p-lg` | `allowPrefixedUtilities` (default `true`) | Most projects; clearly isolates @sue/design-web-vue utilities |
| **Namespace-safe (preferred replacement for the legacy bare form)** | `bg-sue-primary`, `p-sue-lg` | `tokenPrefix` (default `'sue'`, empty disables) | You want short class names without polluting UnoCSS native tokens |
| **Legacy bare (back-compat)** | `bg-primary`, `p-lg` | `allowUnprefixed` (default `true`; will flip to `false` next major) | Existing projects only |

Example:

```vue
<template>
  <!-- Stable prefixed API -->
  <div class="sue-bg-primary sue-color-white sue-p-lg sue-rounded-lg sue-shadow-card">
    Prefixed
  </div>

  <!-- Namespace-safe API (recommended) -->
  <div class="bg-sue-primary color-sue-white p-sue-lg rounded-sue-lg shadow-sue-card">
    Namespace safe
  </div>

  <!-- Legacy bare form (still works, but risks collisions) -->
  <div class="bg-primary color-white p-lg rounded-lg shadow-card">
    Legacy bare
  </div>
</template>
```

Important details:

- Text color uses `color-primary` or `c-primary` (or `color-sue-primary` / `c-sue-primary` in namespace mode)
- `text-*` is primarily for font size, e.g. `text-lg`, `text-h1` (in namespace mode: `text-sue-lg`)

If you want to allow only `sue-*` and `*-sue-*` utilities while disabling the legacy bare form:

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@@sue/design-web-vue/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      allowUnprefixed: false, // disables bg-primary / text-sm style classes
      // allowPrefixedUtilities: true and tokenPrefix: 'sue' remain in effect
    }),
  ],
})
```

> `allowUnprefixed: false` only disables legacy bare classes — it **does not** rewrite theme keys. `sue-bg-primary` and `bg-sue-primary` continue to work.

## Spacing Tokens (aligned with antdv 1.3.0)

- Padding: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`
- Margin: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

> Starting from 1.1.0, `p-xxl`, `p-xxxl`, and `m-xxxl` are no longer generated because antdv 1.3.0 removed the underlying CSS variables. If you are still on @sue/design-web-vue 1.2.x or earlier, pin `@@sue/design-web-vue/unocss` to the 1.0.x line.

## Utility Examples

```vue
<template>
  <div class="sue-bg-primary sue-color-white sue-p-lg sue-rounded-lg sue-shadow-card">
    Primary card
  </div>

  <div class="sue-bg-container sue-color-text sue-px-md sue-py-sm sue-border-border sue-rounded-sm">
    Container content
  </div>

  <div class="sue-text-lg sue-color-primary sue-mt-sm">
    Heading text
  </div>
</template>
```

Common utility groups (each has `sue-*`, `*-sue-*`, and bare forms):

- colors: `color-*`, `bg-*`, `border-*` (plus shorthand `b-*` and directional `bt-`, `bx-`, etc.)
- spacing: `m-*`, `p-*`, `mx-*`, `py-*`
- radius: `rounded-*`, `rd-*`
- shadows: `shadow-*`
- typography: `text-*`

## Common Utility Reference

### Colors and Backgrounds

| Prefixed | Namespace-safe | Description |
| --- | --- | --- |
| `sue-bg-primary` | `bg-sue-primary` | Primary background |
| `sue-bg-container` | `bg-sue-container` | Container background |
| `sue-bg-success-bg` | `bg-sue-success-bg` | Light success background |
| `sue-color-primary` | `color-sue-primary` | Primary text color |
| `sue-color-text` | `color-sue-text` | Default text color |
| `sue-color-text-secondary` | `color-sue-text-secondary` | Secondary text |
| `sue-border-border` | `border-sue-border` | Default border |
| `sue-border-t-primary` | `border-t-sue-primary` | Top primary border |

### Spacing and Layout

| Prefixed | Namespace-safe | Description |
| --- | --- | --- |
| `sue-p-lg` | `p-sue-lg` | 24px padding |
| `sue-px-md` | `px-sue-md` | 20px horizontal padding |
| `sue-py-sm` | `py-sue-sm` | 12px vertical padding |
| `sue-mt-sm` | `mt-sue-sm` | 12px top margin |
| `sue-mx-lg` | `mx-sue-lg` | 24px horizontal margin |
| `sue-my-xs` | `my-sue-xs` | 8px vertical margin |

### Radius, Shadow, Typography

| Prefixed | Namespace-safe | Description |
| --- | --- | --- |
| `sue-rounded-sm` | `rounded-sue-sm` | Small radius |
| `sue-rounded-lg` | `rounded-sue-lg` | Large radius |
| `sue-rounded` | `rounded-yc` | Default radius |
| `sue-shadow-card` | `shadow-sue-card` | Card shadow |
| `sue-shadow` | `shadow-yc` | Default shadow |
| `sue-text-lg` | `text-sue-lg` | Large text |
| `sue-text-h1` | `text-sue-h1` | H1 title size |

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

## Theme and Variables

These presets map utilities to Ant Design CSS variables, so colors, radius, shadows, and typography follow the active theme automatically.

## Notes

- The preset mainly customizes `m-*` / `p-*` related utilities and does not override UnoCSS global spacing behavior (`w-*`, `max-w-*`, `gap-*` keep their UnoCSS defaults).
- The default `prefix` is `sue`, so generated classes usually look like `sue-bg-primary` and `sue-p-lg`.
- `allowUnprefixed` defaults to `true` today but will flip to `false` in the next major. Migrate to `sue-*` or `*-sue-*` writers early.
- `allowUnprefixed: false` only disables the legacy bare form — it **does not** rewrite theme keys (`colors.primary` stays `colors.primary`).
- The default `antPrefix` is `sue`. If you customize your CSS variable prefix, keep this option aligned.
- The default `tokenPrefix` is `sue`. Override it (for example `'yds'`) to customize the namespace, or pass an empty string to disable namespace mode.
