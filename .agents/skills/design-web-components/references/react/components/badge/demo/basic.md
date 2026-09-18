# Basic

## Source

```tsx
import { Clock } from 'lucide-react'
import React from 'react';
;
import { Avatar, Badge, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space size="medium">
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={0} showZero>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={<Clock style={{ color: '#f5222d' }} />}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
```
