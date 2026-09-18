---
title: Empty
description: Empty state placeholder.
---

## When To Use

- Use Empty when a list, table, chart, or panel has no data to show. See `demo/basic.md`.
- Use simple, no-description, or custom variants to match the density and tone of the host surface. See `demo/simple.md`, `demo/description.md`, and `demo/customize.md`.
- Use ConfigProvider when empty state should be configured globally. See `demo/config-provider.md`.
- For full-page success, error, or exception states, use the `result` scenario in `@sue/design-web-scenarios`.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Choose image | demo/simple.md |
| Customize | demo/customize.md |
| ConfigProvider | demo/config-provider.md |
| Custom semantic dom styling | demo/style-class.md |
| No description | demo/description.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | EmptyClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | EmptyStylesType | - | - |
| image | Customize image. Will treat as image url when string provided | VueNode | `Empty.PRESENTED_IMAGE_DEFAULT` | - |
| description | Customize description | VueNode | - | - |
| rootClass | Root container class | string | - | - |
| prefixCls | Prefix class name | string | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| image | Customize image. Will treat as image url when string provided | () => any | - |
| description | Customize description | () => any | - |
| default | Footer content | () => any | - |

## Built-in images 
- Empty.PRESENTED_IMAGE_SIMPLE

  <div class="site-empty-buildIn-img site-empty-buildIn-simple"></div>

- Empty.PRESENTED_IMAGE_DEFAULT

  <div class="site-empty-buildIn-img site-empty-buildIn-default"></div>

<style>
  .site-empty-buildIn-img {
    background-repeat: no-repeat;
    background-size: contain;
  }
  .site-empty-buildIn-simple {
    width: 55px;
    height: 35px;
    background-image: url("https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png");
  }
  .site-empty-buildIn-default {
    width: 121px;
    height: 116px;
    background-image: url("https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png");
  }
</style>

## Semantic DOM

| _semantic | demo/_semantic.md |
