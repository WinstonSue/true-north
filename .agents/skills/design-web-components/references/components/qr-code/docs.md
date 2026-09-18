---
title: QRCode
description: Components that can convert text into QR codes, and support custom color and logo.
---

## When To Use

- Use QRCode to generate scannable codes for URLs, text, or transfer tokens. See `demo/base.md`.
- Use icon, color, size, error level, or type demos for visual and reliability tuning. See `demo/icon.md`, `demo/customColor.md`, `demo/customSize.md`, `demo/errorLevel.md`, and `demo/type.md`.
- Use status, custom status render, download, or Popover demos for loading/error/download workflows. See `demo/status.md`, `demo/customStatusRender.md`, `demo/download.md`, and `demo/Popover.md`.

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | scanned text | string \| string[] | - | - |
| type | render type | `canvas` \| `svg` | `canvas` | - |
| icon | include image url (only image link are supported) | string | - | - |
| size | QRCode size | number | 160 | - |
| iconSize | include image size | number \| &#123; width: number; height: number &#125; | 40 | - |
| color | QRCode Color | string | `#000` | - |
| bgColor | QRCode Background Color | string | `transparent` | - |
| marginSize | Quiet zone size (in modules). `0` means no margin | number | `0` | - |
| bordered | Whether has border style | boolean | `true` | - |
| errorLevel | Error Code Level | `'L'` \| `'M'` \| `'Q'` \| `'H'` | `'M'` | - |
| boostLevel | If enabled, the Error Correction Level of the result may be higher than the specified Error Correction Level | boolean | true | - |
| status | QRCode status | `'active'` \| `'expired'` \| `'loading'` \| `'scanned'` | `'active'` | - |
| statusRender | custom status render | (info: StatusRenderInfo) =&gt; VueNode | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| refresh | Refresh the QR code | () =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| statusRender | custom status render | (info: StatusRenderInfo) =&gt; any | - |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### About QRCode ErrorLevel 
The ErrorLevel means that the QR code can be scanned normally after being blocked, and the maximum area that can be blocked is the error correction rate.

Generally, the QR code is divided into 4 error correction levels: Level `L` can correct about `7%` errors, Level `M` can correct about `15%` errors, Level `Q` can correct about `25%` errors, and Level `H` can correct about `30%` errors. When the content encoding of the QR code carries less information, in other words, when the value link is short, set different error correction levels, and the generated image will not change.

> For more information, see the: [https://www.qrcode.com/en/about/error_correction](https://www.qrcode.com/en/about/error_correction.html)

### ⚠️⚠️⚠️ Cannot scan the QR code? 
If the QR code cannot be scanned for identification, it may be because the link address is too long, which leads to too dense pixels.

You can configure the QR code to be larger through size, or shorten the link through short link services.
