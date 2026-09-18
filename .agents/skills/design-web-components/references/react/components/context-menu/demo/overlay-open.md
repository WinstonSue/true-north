# The way of hiding menu.

## Source

```tsx
import React, { useState } from 'react';
import type { ContextMenuProps, MenuProps } from '@sue/design-web-react';
import { ContextMenu, theme } from '@sue/design-web-react';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      setOpen(false);
    }
  };

  const handleOpenChange: ContextMenuProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Clicking me will not close the menu.',
      key: '1',
    },
    {
      label: 'Clicking me will not close the menu also.',
      key: '2',
    },
    {
      label: 'Clicking me will close the menu.',
      key: '3',
    },
  ];

  return (
    <ContextMenu
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <div
        style={{
          color: colorTextTertiary,
          background: colorBgLayout,
          height: 200,
          textAlign: 'center',
          lineHeight: '200px',
        }}
      >
        Right Click on here
      </div>
    </ContextMenu>
  );
};

export default App;
```
