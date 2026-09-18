# Text & icon

## Source

```tsx
import { Check, Frown, Smile, X } from 'lucide-react'
import React from 'react';
;
import { Flex, Switch } from '@sue/design-web-react';

const Demo: React.FC = () => (
  <Flex gap="medium" align="flex-start" justify="flex-start" vertical>
    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
    <Switch checkedChildren={1} unCheckedChildren={0} defaultChecked />
    <Switch
      defaultChecked
      checkedChildren={<Check  />}
      unCheckedChildren={<X  />}
    />
    <Switch
      defaultChecked
      checkedChildren={
        <Flex gap={4} justify="flex-start" align="center">
          <Smile  />
          Happy
        </Flex>
      }
      unCheckedChildren={
        <Flex gap={4} justify="flex-start" align="center">
          <Frown  />
          Sad
        </Flex>
      }
    />
  </Flex>
);

export default Demo;
```
