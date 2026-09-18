# Status

## Source

```tsx
import { Clock } from 'lucide-react'
import React from 'react';

import { InputNumber, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <InputNumber status="error" style={{ width: '100%' }} />
    <InputNumber status="warning" style={{ width: '100%' }} />
    <InputNumber status="error" style={{ width: '100%' }} prefix={<Clock  />} />
    <InputNumber status="warning" style={{ width: '100%' }} prefix={<Clock  />} />
  </Space>
);

export default App;
```
