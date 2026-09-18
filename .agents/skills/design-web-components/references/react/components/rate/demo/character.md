# Other Character

## Source

```tsx
import { Heart } from 'lucide-react'
import React from 'react';
;
import { Flex, Rate } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Rate character={<Heart  />} allowHalf />
    <Rate character="A" allowHalf style={{ fontSize: 36 }} />
    <Rate character="好" allowHalf />
  </Flex>
);

export default App;
```
