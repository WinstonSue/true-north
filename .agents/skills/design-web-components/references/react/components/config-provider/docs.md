---
title: "ConfigProvider"
description: "Provide a uniform configuration support for components."
---

## Demos

| Demo | Path |
| --- | --- |
| Locale | demo/locale.md |
| Direction | demo/direction.md |
| Component size | demo/size.md |
| Theme | demo/theme.md |
| Custom Wave | demo/wave.md |

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | Config antd component `disabled` | boolean | - | 4.21.0 |
| componentSize | Config antd component size | `small` \| `medium` \| `large` | - |  |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | { nonce: string } | - |  |
| direction | Set direction of layout. See [demo](#config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` |  |
| getPopupContainer | To set the container of the popup element. The default is to create a `div` element in `body` | `(trigger?: HTMLElement) => HTMLElement \| ShadowRoot` | () => document.body |  |
| getTargetContainer | Config Affix, Anchor scroll target container | `() => HTMLElement \| Window \| ShadowRoot` | () => window | 4.2.0 |
| iconPrefixCls | Set icon prefix className | string | `anticon` | 4.11.0 |
| locale | Language package setting, you can find the packages in [antd/locale](https://unpkg.com/antd/locale/) | object | - |  |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | - | 5.5.0 |
| popupOverflow | Select like component popup logic. Can set to show in viewport or follow window scroll | 'viewport' \| 'scroll' <InlinePopover previewURL="https://user-images.githubusercontent.com/5378891/230344474-5b9f7e09-0a5d-49e8-bae8-7d2abed6c837.png"></InlinePopover> | 'viewport' | 5.5.0 |
| prefixCls | Set prefix className | string | `ant` |  |
| renderEmpty | Set empty content of components. Ref [Empty](/components/empty/) | function(componentName: string): ReactNode | - |  |
| theme | Set theme, ref [Customize Theme](../../docs/react/customize-theme.md) | [Theme](../../docs/react/customize-theme.md#theme) | - | 5.0.0 |
| variant | Set variant of data entry components | `outlined` \| `filled` \| `borderless` | - | 5.19.0 |
| virtual | Disable virtual scroll when set to `false` | boolean | - | 4.3.0 |
| warning | Config warning level, when `strict` is `false`, it will aggregate deprecated information into a single message | { strict: boolean } | - | 5.10.0 |

### ConfigProvider.config() {#config}

Setting `Modal`, `Message`, `Notification` static config. Does not work on hooks.

```tsx
ConfigProvider.config({
  // 5.13.0+
  holderRender: (children) => (
    <ConfigProvider
      prefixCls="ant"
      iconPrefixCls="anticon"
      theme={{ token: { colorPrimary: 'red' } }}
    >
      {children}
    </ConfigProvider>
  ),
});
```

### ConfigProvider.useConfig() <Badge>5.3.0+</Badge> {#useconfig}

Get the value of the parent `Provider`, Such as `DisabledContextProvider`, `SizeContextProvider`.

```jsx
const {
  componentDisabled, // 5.3.0+
  componentSize, // 5.3.0+
} = ConfigProvider.useConfig();
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | antd component disabled state | boolean | - | 5.3.0 |
| componentSize | antd component size state | `small` \| `medium` \| `large` | - | 5.3.0 |

### Component Config

The following config keys set common props for corresponding components or global effects. See the related APIs for details:

- `affix`: [Affix](../affix/docs.md#api) (supported since 6.0.0)
- `alert`: [Alert](../alert/docs.md#api) (supported since 5.7.0)
- `anchor`: [Anchor](../anchor/docs.md#api) (supported since 6.0.0)
- `app`: [App](../app/docs.md#api) (supported since 6.3.0)
- `avatar`: [Avatar](../avatar/docs.md#api) (supported since 5.7.0)
- `badge`: [Badge](../badge/docs.md#api) (supported since 5.7.0)
- `borderBeam`: [BorderBeam](../border-beam/docs.md#api) (supported since 6.4.0)
- `breadcrumb`: [Breadcrumb](../breadcrumb/docs.md#api) (supported since 5.7.0)
- `button`: [Button](../button/docs.md#api) (supported since 5.6.0)
- `card`: [Card](../card/docs.md#api) (supported since 5.14.0)
- `cardMeta`: [Card.Meta](../card/docs.md#cardmeta) (supported since 6.0.0)
- `calendar`: [Calendar](../calendar/docs.md#api) (supported since 6.0.0)
- `carousel`: [Carousel](../carousel/docs.md#api) (supported since 5.7.0)
- `cascader`: [Cascader](../cascader/docs.md#api) (supported since 5.13.0)
- `checkbox`: [Checkbox](../checkbox/docs.md#api) (supported since 6.0.0)
- `collapse`: [Collapse](../collapse/docs.md#api) (supported since 5.15.0)
- `colorPicker`: [ColorPicker](../color-picker/docs.md#api) (supported since 6.3.0)
- `datePicker`: [DatePicker](../date-picker/docs.md#api) (supported since 5.7.0)
- `rangePicker`: [RangePicker](../date-picker/docs.md#rangepicker) (supported since 5.11.0)
- `descriptions`: [Descriptions](../descriptions/docs.md#api) (supported since 5.23.0)
- `divider`: [Divider](../divider/docs.md#api) (supported since 5.10.0)
- `drawer`: [Drawer](../drawer/docs.md#api) (supported since 5.10.0)
- `dropdown`: [Dropdown](../dropdown/docs.md#api) (supported since 5.11.0)
- `empty`: [Empty](../empty/docs.md#api) (supported since 5.23.0)
- `flex`: [Flex](../flex/docs.md#api) (supported since 5.10.0)
- `floatButton`: [FloatButton](../float-button/docs.md#api) (supported since 6.0.0)
- `floatButtonGroup`: [FloatButton.Group](../float-button/docs.md#floatbuttongroup) (supported since 5.16.0)
- `form`: [Form](../form/docs.md#api) (supported since 4.8.0)
- `image`: [Image](../image/docs.md#api) (supported since 5.14.0)
- `input`: [Input](../input/docs.md#input) (supported since 4.2.0)
- `inputNumber`: [InputNumber](../input-number/docs.md#api) (supported since 5.19.0)
- `otp`: [Input.OTP](../input/docs.md#inputotp) (supported since 6.0.0)
- `inputPassword`: [Input.Password](../input/docs.md#inputpassword) (supported since 6.4.0)
- `inputSearch`: [Input.Search](../input/docs.md#inputsearch) (supported since 6.4.0)
- `textArea`: [Input.TextArea](../input/docs.md#inputtextarea) (supported since 5.15.0)
- `layout`: [Layout](../layout/docs.md#api) (supported since 5.7.0)
- `list`: [List](../list/docs.md#api) (supported since 5.7.0)
- `masonry`: [Masonry](../masonry/docs.md#api) (supported since 6.0.0)
- `menu`: [Menu](../menu/docs.md#api) (supported since 5.15.0)
- `mentions`: [Mentions](../mentions/docs.md#api) (supported since 5.13.0)
- `message`: [Message](../message/docs.md#api) (supported since 5.7.0)
- `modal`: [Modal](../modal/docs.md#api) (supported since 5.10.0)
- `notification`: [Notification](../notification/docs.md#api) (supported since 5.14.0)
- `pagination`: [Pagination](../pagination/docs.md#api) (supported since 6.0.0)
- `progress`: [Progress](../progress/docs.md#api) (supported since 5.7.0)
- `radio`: [Radio](../radio/docs.md#api) (supported since 6.0.0)
- `rate`: [Rate](../rate/docs.md#api) (supported since 5.7.0)
- `result`: [Result](../result/docs.md#api) (supported since 6.0.0)
- `ribbon`: [Badge.Ribbon](../badge/docs.md#badgeribbon) (supported since 6.0.0)
- `skeleton`: [Skeleton](../skeleton/docs.md#api) (supported since 6.0.0)
- `segmented`: [Segmented](../segmented/docs.md#api) (supported since 6.0.0)
- `select`: [Select](../select/docs.md#api) (supported since 5.13.0)
- `slider`: [Slider](../slider/docs.md#api) (supported since 5.23.0)
- `switch`: [Switch](../switch/docs.md#api) (supported since 6.0.0)
- `space`: [Space](../space/docs.md#api) (supported since 5.6.0)
- `splitter`: [Splitter](../splitter/docs.md#api) (supported since 5.21.0)
- `spin`: [Spin](../spin/docs.md#api) (supported since 5.20.0)
- `statistic`: [Statistic](../statistic/docs.md#api) (supported since 6.0.0)
- `steps`: [Steps](../steps/docs.md#api) (supported since 5.10.0)
- `table`: [Table](../table/docs.md#api) (supported since 6.2.0)
- `tabs`: [Tabs](../tabs/docs.md#api) (supported since 5.14.0)
- `tag`: [Tag](../tag/docs.md#api) (supported since 5.14.0)
- `timeline`: [Timeline](../timeline/docs.md#api) (supported since 6.0.0)
- `timePicker`: [TimePicker](../time-picker/docs.md#api) (supported since 5.13.0)
- `tour`: [Tour](../tour/docs.md#api) (supported since 5.14.0)
- `tooltip`: [Tooltip](../tooltip/docs.md#api) (supported since 6.1.0)
- `popover`: [Popover](../popover/docs.md#api) (supported since 5.23.0)
- `popconfirm`: [Popconfirm](../popconfirm/docs.md#api) (supported since 5.23.0)
- `qrcode`: [QRCode](../qr-code/docs.md#api) (supported since 6.0.0)
- `transfer`: [Transfer](../transfer/docs.md#api) (supported since 5.7.0)
- `tree`: [Tree](../tree/docs.md#api) (supported since 6.0.0)
- `treeSelect`: [TreeSelect](../tree-select/docs.md#api) (supported since 5.19.0)
- `typography`: [Typography](../typography/docs.md#api) (supported since 6.4.0)
- `upload`: [Upload](../upload/docs.md#api) (supported since 5.27.0)
- `watermark`: [Watermark](../watermark/docs.md#api) (supported since 6.0.0)
- `wave`: [WaveConfig](#waveconfig) (supported since 5.8.0)

### WaveConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Whether to disable wave effect | boolean | false |  |
| showEffect | Customized wave effect | (node: HTMLElement, info: { className, token, component }) => void | - |  |
| triggerType | The event that triggers wave effect | `click` \| `pointerdown` \| `pointerup` \| `mousedown` \| `mouseup` | `click` | 6.4.0 |

## FAQ

### How to contribute a new language? {#faq-add-locale}

See [&lt;Adding new language&gt;](../../docs/react/i18n.md#adding-new-language).

### Date-related components locale is not working? {#faq-locale-not-work}

See FAQ [Date-related-components-locale-is-not-working?](../../docs/react/faq.md#date-related-components-locale-is-not-working)

### Modal throw error when setting `getPopupContainer`? {#faq-get-popup-container}

Related issue: <https://github.com/yuce-design/yuce-design/issues/19974>

When you config `getPopupContainer` to parentNode globally, Modal will throw error of `triggerNode is undefined` because it did not have a triggerNode. You can try the [fix](https://github.com/afc163/feedback-antd/commit/3e4d1ad1bc1a38460dc3bf3c56517f737fe7d44a) below.

```diff
 <ConfigProvider
-  getPopupContainer={triggerNode => triggerNode.parentNode}
+  getPopupContainer={node => {
+    if (node) {
+      return node.parentNode;
+    }
+    return document.body;
+  }}
 >
   <App />
 </ConfigProvider>
```

### Why can't ConfigProvider props (like `prefixCls` and `theme`) affect ReactNode inside `message.info`, `notification.open`, `Modal.confirm`? {#faq-message-inherit}

antd will dynamic create React instance by `ReactDOM.render` when call message methods. Whose context is different with origin code located context. We recommend `useMessage`, `useNotification` and `useModal` which , the methods came from `message/notification/Modal` has been deprecated in 5.x.

### Locale is not working with Vite in production mode? {#faq-vite-locale-not-work}

Related issue: [#39045](https://github.com/yuce-design/yuce-design/issues/39045)

In production mode of Vite, default exports from cjs file should be used like this: `enUS.default`. So you can directly import locale from `es/` directory like `import enUS from '@sue/design-web-react/es/locale/en_US'` to make dev and production have the same behavior.

### `prefixCls` priority(The former is covered by the latter) {#faq-prefixcls-priority}

1. `ConfigProvider.config({ prefixCls: 'prefix-1' })`
2. `ConfigProvider.config({ holderRender: (children) => <ConfigProvider prefixCls="prefix-2">{children}</ConfigProvider> })`
3. `message.config({ prefixCls: 'prefix-3' })`
