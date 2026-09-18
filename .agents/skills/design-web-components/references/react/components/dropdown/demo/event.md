# Click event

## Source

```tsx
import { ChevronDown } from 'lucide-react'
import React from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import { Dropdown, message, Space } from '@sue/design-web-react';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const onClick: MenuProps['onClick'] = ({ key }) => {
    messageApi.info(`Click on item ${key}`);
  };

  return (
    <>
      {contextHolder}
      <Dropdown menu={{ items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Hover me, Click menu item
            <ChevronDown  />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default App;
```
