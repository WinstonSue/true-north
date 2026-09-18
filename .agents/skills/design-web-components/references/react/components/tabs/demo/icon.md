# Icon

## Source

```tsx
import { MonitorSmartphone, Smartphone } from 'lucide-react'
import React from 'react';
;
import { Tabs } from '@sue/design-web-react';

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="2"
    items={[MonitorSmartphone, Smartphone].map((Icon, i) => {
      const id = String(i + 1);
      return {
        key: id,
        label: `Tab ${id}`,
        children: `Tab ${id}`,
        icon: <Icon />,
      };
    })}
  />
);

export default App;
```
