# Selectable Menu

## Source

```tsx
import { ChevronDown } from 'lucide-react'
import React from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import Typography from '@/components/docs-typography';
import { Dropdown, Space } from '@sue/design-web-react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
];

const App: React.FC = () => (
  <Dropdown
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }}
  >
    <Typography.Link>
      <Space>
        Selectable
        <ChevronDown  />
      </Space>
    </Typography.Link>
  </Dropdown>
);

export default App;
```
