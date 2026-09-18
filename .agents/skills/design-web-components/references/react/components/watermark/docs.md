---
title: "Watermark"
description: "Add specific text or patterns to the page."
---

## When To Use

- Use when the page needs to be watermarked to identify the copyright.
- Suitable for preventing information theft.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Multi-line watermark | demo/multi-line.md |
| Image watermark | demo/image.md |
| Custom configuration | demo/custom.md |
| Modal or Drawer | demo/portal.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

> This component is available since `antd@5.1.0`.

### Watermark

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| width | The width of the watermark, the default value of `content` is its own width | number | 120 |  | × |
| height | The height of the watermark, the default value of `content` is its own height | number | 64 |  | × |
| inherit | Pass the watermark to the pop-up component such as Modal, Drawer | boolean | true | 5.11.0 | × |
| rotate | When the watermark is drawn, the rotation Angle, unit `°` | number | -22 |  | × |
| zIndex | The z-index of the appended watermark element | number | 999 |  | × |
| image | Image source, it is recommended to export 2x or 3x image, high priority (support base64 format) | string | - |  | × |
| content | Watermark text content | string \| [WatermarkText](#watermarktext) \| (string \| [WatermarkText](#watermarktext))[] | - | WatermarkText: 6.5.0 | × |
| font | Text style | [Font](#font) | [Font](#font) |  | × |
| gap | The spacing between watermarks | \[number, number\] | \[100, 100\] |  | × |
| offset | The offset of the watermark from the upper left corner of the container. The default is `gap/2` | \[number, number\] | \[gap\[0\]/2, gap\[1\]/2\] |  | × |
| onRemove | Callback when the watermark is removed by DOM mutation | `() => void` | - | 6.0.0 | × |

### WatermarkText

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| font | Custom line text style | [Font](#font) | - | 6.5.0 |
| text | Line text | string | - | 6.5.0 |

### Font

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | font color | [CanvasFillStrokeStyles.fillStyle](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) | rgba(0,0,0,.15) |  |
| fontSize | font size | number | 16 |  |
| fontWeight | font weight | `normal` \| `lighter` \| `bold` \| `bolder` \| number | normal |  |
| fontFamily | font family | string | sans-serif |  |
| fontStyle | font style  | `none` \| `normal` \| `italic` \| `oblique` | normal |  |
| textAlign | specify the text alignment direction  | [CanvasTextAlign](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) | `center` | 5.10.0 |

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### Handle abnormal image watermarks {#faq-invalid-image}

When using an image watermark and the image loads abnormally, you can add `content` at the same time to prevent the watermark from becoming invalid (since 5.2.3).

```typescript jsx
<Watermark
  height={30}
  width={130}
  content="Yuce Design"
  image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
>
  <div style={{ height: 500 }} />
</Watermark>
```

### Why `overflow: hidden` style is added since version 5.18.0? {#faq-overflow-hidden}

User can hide the watermark by setting the container height to 0 through the developer tool in the previous version. To avoid this situation, we added the `overflow: hidden` style to the container. When the container height changes, the content is also hidden. You can override the style to modify this behavior:

```tsx
<Watermark style={{ overflow: 'visible' }} />
```
