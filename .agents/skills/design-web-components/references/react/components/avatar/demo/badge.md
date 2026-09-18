# With Badge

## Source

```tsx
import { User } from 'lucide-react'
import React from 'react';
;
import { Avatar, Badge, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space size={24}>
    <Badge count={1}>
      <Avatar shape="square" icon={<User  />} />
    </Badge>
    <Badge dot>
      <Avatar shape="square" icon={<User  />} />
    </Badge>
  </Space>
);

export default App;
```
