# Basic

## Source

```tsx
import { User } from 'lucide-react'
import React from 'react';
;
import { Avatar, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space vertical size={16}>
    <Space wrap size={16}>
      <Avatar size={64} icon={<User  />} />
      <Avatar size="large" icon={<User  />} />
      <Avatar icon={<User  />} />
      <Avatar size="small" icon={<User  />} />
      <Avatar size={14} icon={<User  />} />
    </Space>
    <Space wrap size={16}>
      <Avatar shape="square" size={64} icon={<User  />} />
      <Avatar shape="square" size="large" icon={<User  />} />
      <Avatar shape="square" icon={<User  />} />
      <Avatar shape="square" size="small" icon={<User  />} />
      <Avatar shape="square" size={14} icon={<User  />} />
    </Space>
  </Space>
);

export default App;
```
