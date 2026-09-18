---
title: "Avatar"
description: "Used to represent users or things, supporting the display of images, icons, or characters."
---

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Type | demo/type.md |
| Autoset Font Size | demo/dynamic.md |
| With Badge | demo/badge.md |
| Avatar.Group | demo/group.md |
| Responsive Size | demo/responsive.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Avatar

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| alt | This attribute defines the alternative text describing the image | string | - |  | × |
| gap | Letter type unit distance between left and right sides | number | 4 | 4.3.0 | × |
| icon | Custom icon type for an icon avatar | ReactNode | - |  | × |
| shape | The shape of avatar | `circle` \| `square` | `circle` |  | × |
| size | The size of the avatar | number \| `large` \| `medium` \| `small` \| { xs: number, sm: number, ...} | `medium` | 4.7.0 | × |
| src | The address of the image for an image avatar or image element | string \| ReactNode | - | ReactNode: 4.8.0 | × |
| srcSet | A list of sources to use for different screen resolutions | string | - |  | × |
| draggable | Whether the picture is allowed to be dragged | boolean \| `'true'` \| `'false'` | true |  | × |
| crossOrigin | CORS settings attributes | `'anonymous'` \| `'use-credentials'` \| `''` | - | 4.17.0 | × |
| onError | Handler when img load error, return false to prevent default fallback behavior | () => boolean | - |  | × |

> Tip: You can set `icon` or `children` as the fallback for image load error, with the priority of `icon` > `children`

### Avatar.Group <Badge>4.5.0+</Badge>

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| max | Set maximum display related configurations | `{ count?: number; style?: CSSProperties; popover?: PopoverProps }` | - | 5.18.0 |
| size | The size of the avatar | number \| `large` \| `medium` \| `small` \| { xs: number, sm: number, ...} | `medium` | 4.8.0 |
| shape | The shape of the avatar | `circle` \| `square` | `circle` | 5.8.0 |

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
