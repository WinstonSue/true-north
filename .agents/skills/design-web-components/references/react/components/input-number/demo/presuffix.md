# Prefix / Suffix

## Source

```tsx
import { User } from 'lucide-react'
import React from 'react';
;
import { Flex, InputNumber, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <InputNumber prefix="￥" style={{ width: '100%' }} />

    <Space.Compact block>
      <Space.Addon>
        <User  />
      </Space.Addon>
      <InputNumber prefix="￥" style={{ width: '100%' }} />
    </Space.Compact>

    <InputNumber prefix="￥" disabled style={{ width: '100%' }} />

    <InputNumber suffix="RMB" style={{ width: '100%' }} />
  </Flex>
);

export default App;
```
