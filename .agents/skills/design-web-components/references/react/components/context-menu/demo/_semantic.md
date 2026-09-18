#  semantic

## Source

```tsx
import { Pencil, Save, Trash2 } from 'lucide-react'
import React from 'react';
;
import { ContextMenu } from '@sue/design-web-react';
import type { ContextMenuProps, MenuProps } from '@sue/design-web-react';

import useLocale from '@/hooks/useLocale';
import SemanticPreview from '@/components/SemanticPreview';

const locales = {
  cn: {
    root: '右键菜单的根元素，设置定位、层级和容器样式',
    itemTitle: '菜单选项的标题内容区域，设置布局和文字样式',
    item: '菜单的单个选项元素，设置选项的交互状态和背景样式',
    itemContent: '菜单选项的主要内容区域，设置内容布局和链接样式',
    itemIcon: '菜单选项的图标区域，设置图标的尺寸和间距样式',
  },
  en: {
    root: 'Root element of the context menu, sets positioning, z-index and container styles',
    itemTitle: 'Title content area of a menu option, sets layout and text styles',
    item: 'Individual menu option element, sets interaction states and background styles',
    itemContent: 'Main content area of a menu option, sets content layout and link styles',
    itemIcon: 'Icon area of a menu option, sets icon size and spacing styles',
  },
};

const items: MenuProps['items'] = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      {
        key: '1-1',
        label: '1st menu item',
        icon: <Save  />,
      },
      {
        key: '1-2',
        label: '2nd menu item',
        icon: <Pencil  />,
      },
    ],
  },
  {
    key: 'SubMenu',
    label: 'SubMenu',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
  {
    key: '3',
    type: 'divider',
  },
  {
    key: '4',
    label: 'Delete',
    icon: <Trash2  />,
    danger: true,
  },
];

const Block: React.FC<Readonly<ContextMenuProps>> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div style={{ height: 120, position: 'absolute', top: 50 }} ref={divRef}>
      <ContextMenu
        open
        {...props}
        menu={{ items, defaultOpenKeys: ['SubMenu'] }}
        styles={{ root: { width: 200, zIndex: 1 } }}
        getPopupContainer={() => divRef.current!}
      >
        <a onClick={(e) => e.preventDefault()}>Right Click on here</a>
      </ContextMenu>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="ContextMenu"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'itemTitle', desc: locale.itemTitle },
        { name: 'item', desc: locale.item },
        { name: 'itemContent', desc: locale.itemContent },
        { name: 'itemIcon', desc: locale.itemIcon },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
```
