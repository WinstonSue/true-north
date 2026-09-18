# Three sizes of Input

## Source

```tsx
import { User } from 'lucide-react'
import React from 'react';
;
import { Flex, Input } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Input size="large" placeholder="large size" prefix={<User  />} />
    <Input placeholder="default size" prefix={<User  />} />
    <Input size="small" placeholder="small size" prefix={<User  />} />
  </Flex>
);

export default App;
```
