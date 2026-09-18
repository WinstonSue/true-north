# Status

## Source

```tsx
import { Clock } from 'lucide-react'
import React from 'react';

import { Input, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <Input status="error" placeholder="Error" />
    <Input status="warning" placeholder="Warning" />
    <Input status="error" prefix={<Clock  />} placeholder="Error with prefix" />
    <Input status="warning" prefix={<Clock  />} placeholder="Warning with prefix" />
  </Space>
);

export default App;
```
