# Custom spinning indicator

## Source

```tsx
import { Loader2 } from 'lucide-react'
import React from 'react';
;
import { Flex, Spin } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex align="center" gap="medium">
    <Spin indicator={<Loader2 spin />} size="small" />
    <Spin indicator={<Loader2 spin />} />
    <Spin indicator={<Loader2 spin />} size="large" />
    <Spin indicator={<Loader2 style={{ fontSize: 48 }} spin />} />
  </Flex>
);

export default App;
```
