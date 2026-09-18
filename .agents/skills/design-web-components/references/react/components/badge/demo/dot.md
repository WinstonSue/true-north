# Red badge

## Source

```tsx
import { Bell } from 'lucide-react'
import React from 'react';
;
import { Badge, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space>
    <Badge dot>
      <Bell style={{ fontSize: 16 }} />
    </Badge>
    <Badge dot>
      <a href="#">Link something</a>
    </Badge>
  </Space>
);

export default App;
```
