---
title: "QRCode"
description: "Components that can convert text into QR codes, and support custom color and logo."
---

## When To Use

Used when the text needs to be converted into a QR Code.

## Demos

| Demo | Path |
| --- | --- |
| base | demo/base.md |
| With Icon | demo/icon.md |
| other status | demo/status.md |
| custom status render | demo/customStatusRender.md |
| Custom Render Type | demo/type.md |
| Custom Size | demo/customSize.md |
| Custom Color | demo/customColor.md |
| Download QRCode | demo/download.md |
| Error Level | demo/errorLevel.md |
| Advanced Usage | demo/Popover.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

> This component is available since `antd@5.1.0`

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| :-- | :-- | :-- | :-- | :-- | --- |
| value | scanned text | `string \| string[]` | - | `string[]`: 5.28.0 | × |
| type | render type | `canvas \| svg` | `canvas` | 5.6.0 | × |
| icon | include image url (only image link are supported) | string | - | - | × |
| size | QRCode size | number | 160 | - | × |
| iconSize | include image size | number \| { width: number; height: number } | 40 | 5.19.0 | × |
| color | QRCode Color | string | `#000` | - | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | 6.0.0 | 6.0.0 |
| bgColor | QRCode Background Color | string | `transparent` | 5.5.0 | × |
| marginSize | Quiet zone size (in modules). `0` means no margin | number | `0` | 6.2.0 | × |
| bordered | Whether has border style | boolean | true | - | × |
| errorLevel | Error Code Level | `'L' \| 'M' \| 'Q' \| 'H'` | `M` | - | × |
| boostLevel | If enabled, the Error Correction Level of the result may be higher than the specified Error Correction Level | `boolean` | true | 5.28.0 | × |
| status | QRCode status | `active \| expired \| loading \| scanned` | `active` | scanned: 5.13.0 | × |
| statusRender | custom status render | (info: [StatusRenderInfo](../qr-code/docs.md#statusrenderinfo)) => React.ReactNode | - | 5.20.0 | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 6.0.0 | 6.0.0 |

### StatusRenderInfo

```typescript
type StatusRenderInfo = {
  status: QRStatus;
  locale: Locale['QRCode'];
  onRefresh?: () => void;
};
```

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### About QRCode ErrorLevel {#faq-error-correction-level}

The ErrorLevel means that the QR code can be scanned normally after being blocked, and the maximum area that can be blocked is the error correction rate.

Generally, the QR code is divided into 4 error correction levels: Level `L` can correct about `7%` errors, Level `M` can correct about `15%` errors, Level `Q` can correct about `25%` errors, and Level `H` can correct about `30%` errors. When the content encoding of the QR code carries less information, in other words, when the value link is short, set different error correction levels, and the generated image will not change.

> For more information, see the: [https://www.qrcode.com/en/about/error_correction](https://www.qrcode.com/en/about/error_correction.html)

### ⚠️⚠️⚠️ Cannot scan the QR code? {#faq-cannot-scan}

If the QR code cannot be scanned for identification, it may be because the link address is too long, which leads to too dense pixels.

You can configure the QR code to be larger through size, or shorten the link through short link services.
