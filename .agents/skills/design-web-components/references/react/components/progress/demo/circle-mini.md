# Mini size circular progress bar

## Source

```tsx
import React from 'react';
import { Flex, Progress } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex wrap gap="small">
    <Progress type="circle" percent={30} size={80} />
    <Progress type="circle" percent={70} size={80} status="exception" />
    <Progress type="circle" percent={100} size={80} />
  </Flex>
);

export default App;
```
