# Disabled

## Source

```tsx
import React from 'react';
import { Checkbox, Flex } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Checkbox defaultChecked={false} disabled />
    <Checkbox indeterminate disabled />
    <Checkbox defaultChecked disabled />
  </Flex>
);

export default App;
```
