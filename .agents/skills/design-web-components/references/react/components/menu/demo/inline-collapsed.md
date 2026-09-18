# Collapsed inline menu

## Source

```tsx
import { Box, ChartPie, LayoutGrid, Mail, Monitor, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import React, { useState } from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import { Button, Menu } from '@sue/design-web-react';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <ChartPie  />, label: 'Option 1' },
  { key: '2', icon: <Monitor  />, label: 'Option 2' },
  { key: '3', icon: <Box  />, label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <Mail  />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: <LayoutGrid  />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '11', label: 'Option 11' },
          { key: '12', label: 'Option 12' },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ width: 256 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <PanelLeftOpen  /> : <PanelLeftClose  />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default App;
```
