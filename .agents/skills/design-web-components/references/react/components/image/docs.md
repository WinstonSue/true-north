---
title: "Image"
description: "Preview-able image."
---

## When To Use

- When you need to display pictures.
- Display when loading a large image or fault tolerant handling when loading fail.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Progressive Loading | demo/placeholder.md |
| Fault tolerant | demo/fallback.md |
| Multiple image preview | demo/preview-group.md |
| Preview from one image | demo/preview-group-visible.md |
| Custom preview image | demo/previewSrc.md |
| Controlled Preview | demo/controlled-preview.md |
| Custom toolbar render | demo/toolbarRender.md |
| Custom preview render | demo/imageRender.md |
| preview mask | demo/mask.md |
| Custom semantic dom styling | demo/style-class.md |
| nested | demo/nested.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Image

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| alt | Image description | string | - |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| fallback | Fallback URL when load fails | string | - |  | 5.28.0 |
| height | Image height | string \| number | - |  | × |
| placeholder | Loading placeholder, supports ReactNode or config object | [PlaceholderType](#placeholdertype) | - |  | × |
| preview | Preview configuration; set to false to disable | boolean \| [PreviewType](#previewtype) | true |  | `preview.closeIcon`: 5.14.0, `preview.mask`: 6.0.0, `preview.mask.closable`: 6.4.0 |
| src | Image URL | string | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| width | Image width | string \| number | - |  | × |
| onError | Callback when loading error occurs | (event: Event) => void | - |  | × |

Other Property ref [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)

### PlaceholderType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| progress | Progress config, set to `true` to show gradient animation, set `{ percent: number }` to show progress, `render` for custom rendering | boolean \| [ImageProgressConfig](#imageprogressconfig) | - |  |

### ImageProgressConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| percent | Progress value | number | - |  |
| render | Custom rendering, receives default progress UI and percentage | (progress: React.ReactNode, percent: number) => React.ReactNode | - |  |

### PreviewType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Custom toolbar render | (originalNode: React.ReactElement, info: ToolbarRenderInfoType) => React.ReactNode | - |  |
| closeIcon | Custom close icon | React.ReactNode | - |  |
| cover | Custom preview mask | React.ReactNode \| [CoverConfig](#coverconfig) | - | CoverConfig support after v6.0 |
| focusTrap | Whether to trap focus within the preview when open | boolean | true | 6.4.0 |
| getContainer | Specify container for preview mounting; still full screen; false mounts at current location | string \| HTMLElement \| (() => HTMLElement) \| false | - |  |
| imageRender | Custom preview content | (originalNode: React.ReactElement, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo) }) => React.ReactNode | - |  |
| mask | preview mask effect | boolean \| { enabled?: boolean, blur?: boolean, closable?: boolean } | true | mask.closable: 6.4.0 |
| maxScale | Maximum zoom scale | number | 50 |  |
| minScale | Minimum zoom scale | number | 1 |  |
| movable | Whether the preview image can be dragged when it is larger than the viewport | boolean | true |  |
| open | Whether to display preview | boolean | - |  |
| rootClassName | Root DOM class name for preview; applies to both image and preview wrapper | string | - |  |
| scaleStep | Each step's zoom multiplier is 1 + scaleStep | number | 0.5 |  |
| src | Custom preview src | string | - |  |
| styles | Custom semantic structure styles | Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| onOpenChange | Callback when preview open state changes | (visible: boolean) => void | - |  |
| onTransform | Callback for preview transform changes | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - |  |

### PreviewGroup

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  |
| fallback | Fallback URL for load error | string | - |  |
| items | Array of preview items | string[] \| { src: string, crossOrigin: string, ... }[] | - |  |
| preview | Preview configuration; disable by setting to false | boolean \| [PreviewGroupType](#previewgrouptype) | true |  |

### PreviewGroupType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Custom toolbar render | (originalNode: React.ReactElement, info: ToolbarRenderInfoType) => React.ReactNode | - |  |
| closeIcon | Custom close icon | React.ReactNode | - |  |
| countRender | Custom preview count render | (current: number, total: number) => React.ReactNode | - |  |
| focusTrap | Whether to trap focus within the preview when open | boolean | true | 6.4.0 |
| current | Index of the current preview image | number | - |  |
| getContainer | Specify container for preview mounting; still full screen; false mounts at current location | string \| HTMLElement \| (() => HTMLElement) \| false | - |  |
| imageRender | Custom preview content | (originalNode: React.ReactElement, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo), current: number }) => React.ReactNode | - |  |
| mask | preview mask effect | boolean \| { enabled?: boolean, blur?: boolean, closable?: boolean } | true | mask.closable: 6.4.0 |
| minScale | Minimum zoom scale | number | 1 |  |
| maxScale | Maximum zoom scale | number | 50 |  |
| movable | Whether the preview image can be dragged when it is larger than the viewport | boolean | true |  |
| open | Whether to display preview | boolean | - |  |
| styles | Custom semantic structure styles | Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| scaleStep | Each step's zoom multiplier is 1 + scaleStep | number | 0.5 |  |
| onOpenChange | Callback when preview open state changes, includes current preview index | (visible: boolean, info: { current: number }) => void | - |  |
| onChange | Callback when changing preview image | (current: number, prevCurrent: number) => void | - |  |
| onTransform | Callback for preview transform changes | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - |  |

## Interface

### TransformType

```typescript
{
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}
```

### TransformAction

```typescript
type TransformAction =
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'close'
  | 'prev'
  | 'next'
  | 'wheel'
  | 'doubleClick'
  | 'move'
  | 'dragRebound'
  | 'reset';
```

### ToolbarRenderInfoType

```typescript
{
  icons: {
    flipYIcon: React.ReactNode;
    flipXIcon: React.ReactNode;
    rotateLeftIcon: React.ReactNode;
    rotateRightIcon: React.ReactNode;
    zoomOutIcon: React.ReactNode;
    zoomInIcon: React.ReactNode;
  };
  actions: {
    onActive?: (index: number) => void; // support after 5.21.0
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void; // support after 5.17.3
    onClose: () => void;
  };
  transform: TransformType,
  current: number;
  total: number;
  image: ImgInfo
}
```

### ImgInfo

```typescript
{
  url: string;
  alt: string;
  width: string | number;
  height: string | number;
}
```

### CoverConfig

```typescript
type CoverConfig = {
  coverNode?: React.ReactNode; // The custom node of preview mask
  placement?: 'top' | 'bottom' | 'center'; // Set the position of the preview mask display.
};
```

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
