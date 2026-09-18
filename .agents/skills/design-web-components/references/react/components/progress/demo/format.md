# Custom text format

## Source

```tsx
import React from 'react';
import { Flex, Progress } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} />
    <Progress type="circle" percent={100} format={() => 'Done'} />
  </Flex>
);

export default App;
```
