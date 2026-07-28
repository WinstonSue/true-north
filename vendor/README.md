# Vendor

## `@sue/design-web-react`

Published `0.0.3-beta` still contains unresolved `catalog:prod` dependency ranges
(`dayjs`, `@ant-design/colors`, `@ant-design/fast-color`). pnpm rejects that
protocol for packages outside the workspace, so we vendor a patched copy with
real semver ranges.

Refresh:

```bash
./scripts/vendor-sue-design-web-react.sh
```
