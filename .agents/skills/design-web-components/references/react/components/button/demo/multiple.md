# Multiple Buttons

## Source

```tsx
import { Ellipsis } from 'lucide-react'
import React from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import { Button, Dropdown, Flex, Space } from '@sue/design-web-react';

const onMenuClick: MenuProps['onClick'] = (e) => {
  console.log('click', e);
};

const items = [
  {
    key: '1',
    label: '1st item',
  },
  {
    key: '2',
    label: '2nd item',
  },
  {
    key: '3',
    label: '3rd item',
  },
];

const App: React.FC = () => (
  <Flex align="flex-start" gap="small" vertical>
    <Button type="primary">primary</Button>
    <Button>secondary</Button>
    <Space.Compact>
      <Button>Actions</Button>
      <Dropdown menu={{ items, onClick: onMenuClick }} placement="bottomRight">
        <Button icon={<Ellipsis  />} />
      </Dropdown>
    </Space.Compact>
  </Flex>
);

export default App;
```
