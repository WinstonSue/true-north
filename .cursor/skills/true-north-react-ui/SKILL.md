---
name: true-north-react-ui
description: >-
  True North desktop/plugin page composition, token mapping, localization,
  ProductSurface, and visual acceptance. Use when creating or reviewing
  React pages in apps/desktop or packages/plugins, especially Workflow,
  settings, Growth, Expense, and other host/plugin screens.
---

# True North React UI

Sue Design owns components, tokens, and generic enterprise scenes. This skill owns **application composition**. Read `design-web-skill` / `design-web-components` / `design-web-scenarios` first for Form, Table, Tag, Flex, Card, Empty.

Import source is always `@sue/design-web-react`. Never copy Vue APIs.

## Layering

| Layer | Owner | Use for |
| --- | --- | --- |
| Component / token / generic scene | Sue skills | Form.Item, Card, Tag, Flex `full/fixed/fill`, list-filter, form-basic, `ContextMenu` |
| Application shell | `@true-north/plugin-ui` | `TabsPage`, `DefaultPage`, `PageHeader`, `FilterBar`, `Surface`, `SettingsGroup`, `EmptyState` |
| Domain chrome | plugin-local (e.g. `GrowthPage`) | Plugin nav, domain tokens like `--growth-*` |
| Product facts | `write-product-wiki` | Routes, views, rules — not layout or color |

Do not invent `ProTable`, `PageShell`, or Sue exports that are not in `dist/index.d.ts`.

Right-click command menus use `ContextMenu` from `@sue/design-web-react` (`menu={{ items }}`). Do not use `Dropdown trigger={['contextMenu']}`, and do not wrap Dropdown in `@true-north/plugin-ui`. Click overflow menus stay as `Dropdown`.

## Page types

**Tabbed list** (`layout-flex` + `list-filter`):
- Outer `TabsPage`. Put create/actions in `TabsPage.extra` **or** inner `FilterBar.extra`, never both a tab title and a duplicate page title.
- Body: `Flex vertical container="full"` → `FilterBar` (`fixed`) → `Flex container="fill"` for `Table` / `EmptyState`.
- Parent must have height. Do not use `calc(100vh - Npx)`.
- Status and type use `Tag` / `Badge`. Amounts use `--sue-color-success` / `--sue-color-error`.

**Settings / rules form** (`form-basic`):
- Constrained column (`SettingsGroup` max-width 720). Fill remaining canvas with page background, not stretched controls.
- Labels via `Form.Item`. Section groups via `Card` or `SettingsGroup`. Help text via `Form.Item extra` or `--sue-color-text-secondary`.
- Dynamic lists: `Form.List` or a `Space` row; dashed add buttons `style={{ alignSelf: 'flex-start' }}`, never full-bleed.

**Appearance-like settings**:
- Reuse `SettingsGroup` / `SettingsRow`. Add a short lead. Do not add decorative color.

## Tokens

- Prefer `--sue-*` and `theme.useToken()`.
- `--color-*` is a legacy bridge only.
- `--growth-*` is Growth spacing/layout, not a second color system.

## Localization and ProductSurface

- Every user-visible string goes through `useLocale` / `usePluginRuntime().locale.t`. No mixed EN placeholders in zh UI.
- Template i18n keys (`workflow.template.*`) must resolve at **display** time (`t[key] || key`), not stay as raw keys in tables.
- Wrap explainable regions with `ProductSurface` + `productRef`. Wiki skill does not replace this skill.

## Visual acceptance

Before finishing a UI change, exercise the real page (Electron/dev). Check:

- 1024×768, light and dark
- empty, loading, error, and data states
- hierarchy, density, alignment, inner scroll vs page stretch
- no duplicate chrome, no raw enums, semantic color on status/amount

## Pilot mapping (keep doing this)

| Symptom | Bucket | Fix |
| --- | --- | --- |
| Notify unlabeled stacks / full-width dashed buttons | Sue spec unused | `Form.Item`, `Card`, constrained `Button` |
| Workflow sparse table, plain `published` | Sue spec unused | `layout-flex` + `Tag` |
| Duplicate “定义” / “账单” titles | True North | `TabsPage` / `FilterBar.extra` only |
| i18n key as workflow title, duplicate template rows | True North data | resolve `t[nameKey]`; serialize import + unique `sourceTemplateKey` |
| Expense EN placeholders, `#52c41a` | True North + Sue tokens | locale.t + `--sue-color-*` |
| Appearance empty-looking card | True North density | lead copy; keep settings group |

Do not ask Sue for PageHeader/FilterBar. Promote repeated host/plugin shells into `@true-north/plugin-ui`.
