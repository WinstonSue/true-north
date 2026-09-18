# Button with dropdown menu

## Source

```tsx
import { ChevronDown, Ellipsis, User } from 'lucide-react'
import React from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import { Button, Dropdown, message, Space, Tooltip } from '@sue/design-web-react';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
    icon: <User  />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <User  />,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: <User  />,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: <User  />,
    danger: true,
    disabled: true,
  },
];

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    messageApi.info('Click on left button.');
    console.log('click left button', e);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    messageApi.info('Click on menu item.');
    console.log('click', e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      {contextHolder}
      <Space wrap>
        <Space.Compact>
          <Button onClick={handleButtonClick}>Dropdown</Button>
          <Dropdown menu={menuProps} placement="bottomRight">
            <Button icon={<Ellipsis  />} />
          </Dropdown>
        </Space.Compact>
        <Space.Compact>
          <Button onClick={handleButtonClick}>Dropdown</Button>
          <Dropdown menu={menuProps} placement="bottomRight">
            <Button icon={<User  />} />
          </Dropdown>
        </Space.Compact>
        <Space.Compact>
          <Button onClick={handleButtonClick} disabled>
            Dropdown
          </Button>
          <Dropdown menu={menuProps} placement="bottomRight" disabled>
            <Button icon={<Ellipsis  />} disabled />
          </Dropdown>
        </Space.Compact>
        <Space.Compact>
          <Tooltip title="tooltip">
            <Button onClick={handleButtonClick}>With Tooltip</Button>
          </Tooltip>
          <Dropdown menu={menuProps} placement="bottomRight">
            <Button loading />
          </Dropdown>
        </Space.Compact>
        <Dropdown menu={menuProps}>
          <Button onClick={handleButtonClick} icon={<ChevronDown  />} iconPlacement="end">
            Button
          </Button>
        </Dropdown>
        <Space.Compact>
          <Button onClick={handleButtonClick} danger>
            Danger
          </Button>
          <Dropdown menu={menuProps} placement="bottomRight">
            <Button icon={<Ellipsis  />} danger />
          </Dropdown>
        </Space.Compact>
      </Space>
    </>
  );
};

export default App;
```
