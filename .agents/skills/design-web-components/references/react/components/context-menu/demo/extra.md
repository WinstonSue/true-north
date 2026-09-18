# Extra node

## Source

```tsx
import { Settings } from 'lucide-react'
import React from 'react';
;
import type { MenuProps } from '@sue/design-web-react';
import { ContextMenu, theme } from '@sue/design-web-react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
  {
    key: '3',
    label: 'Billing',
    extra: '⌘B',
  },
  {
    key: '4',
    label: 'Settings',
    icon: <Settings  />,
    extra: '⌘S',
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  return (
    <ContextMenu menu={{ items }}>
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
