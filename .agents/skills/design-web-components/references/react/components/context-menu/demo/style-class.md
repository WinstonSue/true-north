# Custom semantic dom styling

## Source

```tsx
import { LogOut, Settings } from 'lucide-react'
import React from 'react';
;
import { ContextMenu, Flex, Space, theme } from '@sue/design-web-react';
import type { ContextMenuProps, GetProp, MenuProps } from '@sue/design-web-react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  root: {
    backgroundColor: token.colorFillAlter,
    border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
    borderRadius: token.borderRadius,
  },
}));

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Profile',
  },
  {
    key: '2',
    label: 'Settings',
    icon: <Settings  />,
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: 'Logout',
    icon: <LogOut  />,
    danger: true,
  },
];

const objectStyles: ContextMenuProps['styles'] = {
  root: {
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  item: {
    padding: '8px 12px',
    fontSize: '14px',
  },
  itemTitle: {
    fontWeight: '500',
  },
  itemIcon: {
    color: '#1890ff',
    marginInlineEnd: '8px',
  },
  itemContent: {
    backgroundColor: 'transparent',
  },
};

const functionStyles: ContextMenuProps['styles'] = (): GetProp<
  ContextMenuProps,
  'styles',
  'Return'
> => ({
  root: {
    borderColor: '#1890ff',
    borderRadius: '8px',
  },
});

const App: React.FC = () => {
  const { styles } = useStyles();
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  const sharedProps: ContextMenuProps = {
    menu: { items },
    placement: 'bottomLeft',
    classNames: { root: styles.root },
  };

  const areaStyle: React.CSSProperties = {
    color: colorTextTertiary,
    background: colorBgLayout,
    height: 80,
    textAlign: 'center',
    lineHeight: '80px',
    minWidth: 160,
  };

  return (
    <Flex gap="medium" wrap="wrap">
      <Space vertical size="large">
        <ContextMenu {...sharedProps} styles={objectStyles}>
          <div style={areaStyle}>Object Style</div>
        </ContextMenu>

        <ContextMenu {...sharedProps} styles={functionStyles}>
          <div style={areaStyle}>Function Style</div>
        </ContextMenu>
      </Space>
    </Flex>
  );
};

export default App;
```
