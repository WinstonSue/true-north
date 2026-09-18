# Trigger mode

## Source

```tsx
import { ChevronDown } from 'lucide-react'
import React from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import { Dropdown, Space } from '@sue/design-web-react';

const items: MenuProps['items'] = [
  {
    label: (
      <a href="https://www.antgroup.com" target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }} trigger={['click']}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click me
        <ChevronDown  />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```
