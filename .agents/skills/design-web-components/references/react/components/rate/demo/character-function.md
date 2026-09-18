# Customize character

## Source

```tsx
import { Frown, Meh, Smile } from 'lucide-react'
import React from 'react';
;
import { Flex, Rate } from '@sue/design-web-react';

const customIcons: Record<number, React.ReactNode> = {
  1: <Frown  />,
  2: <Frown  />,
  3: <Meh  />,
  4: <Smile  />,
  5: <Smile  />,
};

const App: React.FC = () => (
  <Flex gap="medium" vertical>
    <Rate defaultValue={2} character={({ index = 0 }) => index + 1} />
    <Rate defaultValue={3} character={({ index = 0 }) => customIcons[index + 1]} />
  </Flex>
);

export default App;
```
