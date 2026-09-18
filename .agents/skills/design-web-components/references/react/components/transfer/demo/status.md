# Status

## Source

```tsx
import React from 'react';
import { Flex, Transfer } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex gap="medium" vertical>
    <Transfer status="error" />
    <Transfer status="warning" showSearch />
  </Flex>
);

export default App;
```
