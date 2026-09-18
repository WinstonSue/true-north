import type { WebMappingRule, WebMappingRules } from "./types.ts";

const directComponentTypes = [
  "Alert",
  "Anchor",
  "AutoComplete",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "Cascader",
  "Checkbox",
  "Collapse",
  "ColorPicker",
  "DatePicker",
  "Descriptions",
  "Divider",
  "Dropdown",
  "Empty",
  "Flex",
  "FloatButton",
  "Form",
  "Image",
  "Input",
  "InputNumber",
  "Layout",
  "Masonry",
  "Mentions",
  "Menu",
  "Modal",
  "Pagination",
  "Popconfirm",
  "Popover",
  "Progress",
  "QRCode",
  "Radio",
  "Rate",
  "Segmented",
  "Skeleton",
  "Slider",
  "Space",
  "Spin",
  "Splitter",
  "Statistic",
  "Switch",
  "Table",
  "Tabs",
  "Tag",
  "Timeline",
  "TimePicker",
  "Tooltip",
  "Tour",
  "Transfer",
  "Tree",
  "TreeSelect",
  "EditableText",
  "Upload",
  "Watermark",
] as const;

const componentRuleOverrides: Partial<
  Record<(typeof directComponentTypes)[number], Partial<Pick<WebMappingRule, "aliases" | "props" | "children" | "events" | "notes">>>
> = {
  Segmented: {
    aliases: ["RadioButtonGroup"],
    props: {
      value: "Bind the current mutually exclusive selection to a stable value.",
      options: "Build dynamic choices as { label, value } objects. Keep option value types consistent with business state.",
    },
    events: {
      onChange: "Map the selected value back to business state, then run the existing filter behavior.",
    },
    notes: "Map the Figma semantic `RadioButtonGroup` to Segmented for compact mutually exclusive category controls. Use Radio only when the design is a conventional form-field radio group. Do not emit Vue @change or v-model.",
  },
  Tabs: {
    aliases: ["tabs"],
    props: {
      activeKey: "Bind the current top-level selection to a stable key. Use a stable internal sentinel for an \"all\" option when the business value is empty.",
      items: "Build dynamic tabs as { key, label, children } objects. Dynamic labels do not require a manual button implementation.",
      tabBarExtraContent: "Place aligned controls such as search in the tab bar extra content when the design puts them beside tabs.",
    },
    events: {
      onChange: "Map the selected key back to business state, then run the existing filter behavior.",
    },
    notes: "Map Figma node names `Tabs` and `tabs` to Tabs. Check the React component docs before using manual buttons. Do not use Vue slots or v-model:activeKey.",
  },
  Flex: {
    props: {
      vertical: "Use vertical for stacked toolbars and fill regions.",
      container: "Use full for the outer workspace, fixed for toolbars/filters, and fill for remaining content. The parent must have a definite height.",
      gap: "Map spacing to Flex gap instead of magic margins.",
    },
    notes: "Prefer Flex container=\"full|fixed|fill\" over calc(100vh - Npx). See the layout-flex scenario.",
  },
  Empty: {
    props: {
      description: "Map empty-state copy to Empty.description. Omit when the host already labels the region.",
      image: "Use Empty.PRESENTED_IMAGE_SIMPLE for dense tables, or a custom node when the design supplies one.",
    },
    children: {
      default: "Optional extra actions under the empty description, such as a create button.",
    },
    notes: "Use Empty inside the fill region of a list or table. Full-page success/error/exception states belong to the result scenario.",
  },
  Tag: {
    props: {
      color: "Map semantic status to Tag color (success, processing, error, warning, default) rather than one-off hex values.",
      bordered: "Keep the default bordered treatment unless the design is explicitly ghost/plain.",
    },
    notes: "Use Tag for status chips in tables and headers. Use Badge when the design is a count or a dot on another node.",
  },
  Form: {
    props: {
      form: "Create the instance with Form.useForm() when the page needs imperative validate/reset. Pass it as the form prop.",
      initialValues: "Set initial field values here. Do not use a Vue-style model object.",
      layout: "horizontal | vertical | inline. Use vertical for settings-style pages and inline for compact filter bars.",
      onFinish: "Submit handler after validation succeeds. Receive the value object, not a Vue finish event.",
      onFinishFailed: "Handle failed submit by focusing or summarizing error fields.",
    },
    children: {
      default: "Nest Form.Item and Form.List. Bind fields with name + rules. Use Form.List for repeatable groups.",
    },
    events: {
      onFinish: "Called with validated values after submit succeeds.",
      onFinishFailed: "Called with error info after submit fails validation.",
      onValuesChange: "Observe changed values for dependent fields. Prefer local React state or Form.useWatch over Vue watch.",
    },
    notes: "React Form uses Form.useForm, Form.Item, and Form.List. Never bind model, v-model, or Vue slots. Import Form from @sue/design-web-react.",
  },
};

const directRules = directComponentTypes.map((componentType) => ({
  componentType,
  importSource: "@sue/design-web-react",
  importName: componentType,
  renderStrategy: "component",
  props: {},
  slots: {},
  events: {},
  ...componentRuleOverrides[componentType],
} as const));

export const reactMappingRules = {
  target: "react",
  rules: [
    ...directRules,
    {
      componentType: "Select",
      importSource: "@sue/design-web-react",
      importName: "Select",
      renderStrategy: "component",
      props: {
        value: "Bind the current selection value. For single select this is usually a string or number; multiple/tags use arrays; labelInValue uses labeled objects.",
        options: "Map stable option arrays to { label, value } objects. Keep option value types consistent with the business state.",
        placeholder: "Map placeholder text directly to Select.placeholder.",
        prefix: "Use prefix for fixed leading text or icon inside the selector instead of rendering an external label wrapper.",
        suffixIcon: "Use suffixIcon only when the design requires a custom dropdown icon.",
      },
      slots: {},
      children: {
        prefix: "Pass a custom leading node through the prefix prop or children equivalent from the React docs.",
        suffixIcon: "Pass a custom dropdown icon through suffixIcon.",
      },
      events: {
        onChange: "Do not annotate the callback parameter as a business enum or DTO field type. Let the component value infer, narrow by runtime shape, then pass it to business state. Example: onChange={(value) => { if (typeof value === 'string') setSelectedType(value as BusinessType); }}.",
      },
      notes: "When a design shows fixed leading text or an icon plus selectable content, still render a single Select with prefix. Do not wrap Select in an outer label container. Never emit Vue onUpdate:value or v-model:value.",
    },
    {
      componentType: "Drawer",
      importSource: "@sue/design-web-react",
      importName: "Drawer",
      renderStrategy: "component",
      props: {
        open: "Control drawer visibility with React state. Do not use v-model:open.",
        title: "Map drawer title text to Drawer.title or a title node.",
        closable: "Close button defaults to header end. Use { placement: 'start' } only when the design requires close before the title.",
        extra: "Use extra only for header-corner actions. Do not put bottom action areas here.",
        size: "Map design width to size (number, 'default', or 'large').",
        placement: "Map slide direction to placement: left | right | top | bottom.",
        loading: "Use only when the design explicitly shows skeleton in the drawer body.",
      },
      slots: {},
      children: {
        default: "Drawer body content. Body has no default padding — apply padding on inner containers.",
        extra: "Header-corner actions only (not bottom action areas).",
        title: "Custom title node when the title prop is not enough.",
      },
      events: {
        onClose: "Handle drawer close from mask, close button, or ESC. Sync open state in this callback.",
      },
      notes: "Drawer has no footer prop. When the design shows a bottom action area, render Flex vertical container=\"full\" as children: fill region scrolls (add padding on the fill container), fixed region at the bottom holds actions. Do not use footer, extra for bottom actions, or paddingBottom hacks. See layout-flex.",
    },
    {
      componentType: "Grid",
      importSource: "@sue/design-web-react",
      importName: "Row",
      renderStrategy: "component",
      props: {
        children: "Render layout children with Row and Col.",
        gutter: "Map spacing or layout gap to Row gutter.",
      },
      slots: {},
      children: {
        default: "Use Row children; wrap child nodes in Col when column spans are known.",
      },
      events: {},
      notes: "Grid is implemented by Row/Col exports in @sue/design-web-react.",
    },
    {
      componentType: "Message",
      importSource: "@sue/design-web-react",
      importName: "message",
      renderStrategy: "service",
      props: {
        type: "Map to message.success/info/warning/error/loading, or use App.useApp().message inside React trees.",
        content: "Map semantic message text to service content.",
      },
      slots: {},
      events: {},
      notes: "Message is a service API, not a JSX component. Prefer hooks from App when the host already wraps with App.",
    },
    {
      componentType: "Notification",
      importSource: "@sue/design-web-react",
      importName: "notification",
      renderStrategy: "service",
      props: {
        type: "Map to notification.success/info/warning/error, or use App.useApp().notification.",
        message: "Map semantic title to notification message.",
        description: "Map semantic body text to notification description.",
      },
      slots: {},
      events: {},
      notes: "Notification is a service API, not a JSX component.",
    },
    {
      componentType: "List",
      importSource: "@sue/design-web-react",
      importName: null,
      renderStrategy: "manual",
      props: {
        dataSource: "Render list data with semantic HTML, Space, Card, Empty, Pagination, or Table depending on density.",
        renderItem: "Map item rendering to a local React render function.",
        pagination: "Render Pagination separately when needed.",
      },
      slots: {},
      children: {
        default: "Render item rows/cards manually.",
      },
      events: {},
      notes: "List is in design-spec but is not exported by @sue/design-web-react. Do not invent a List import.",
    },
  ],
} satisfies WebMappingRules;
