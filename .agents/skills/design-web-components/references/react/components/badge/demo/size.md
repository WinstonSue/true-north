# Size

## Source

```tsx
import React from 'react';
import { Avatar, Badge, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space size="medium">
    <Badge size="medium" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge size="small" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
```
