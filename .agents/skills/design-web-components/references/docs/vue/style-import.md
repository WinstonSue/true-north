# Style imports（Vue）

Static styles follow **Strategy B**:

```ts
import '@sue/design-spec/reset.css'
import '@sue/design-web-vue/dist/sue.css' // zeroRuntime / prebuilt CSS
```

Layered CSS:

```css
@layer reset, sue;
@import "@sue/design-spec/reset.css" layer(reset);
@import "@sue/design-web-vue/dist/sue.css" layer(sue);
```

Do **not** import `@sue/design-web-vue/dist/antd.css` or `@sue/design-web-vue/dist/reset.css` (removed).

Seed tokens are authored in `@sue/design-spec` (`tokens.source === "design-spec"`). Full architecture: `docs/style-architecture.md` in the monorepo root.
