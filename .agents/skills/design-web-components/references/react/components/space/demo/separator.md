# separator

## Source

```tsx
import React from 'react';
import { Divider, Space } from '@sue/design-web-react';
import Typography from '@/components/docs-typography';

const App: React.FC = () => (
  <Space separator={<Divider vertical />}>
    <Typography.Link>Link</Typography.Link>
    <Typography.Link>Link</Typography.Link>
    <Typography.Link>Link</Typography.Link>
  </Space>
);

export default App;
```
