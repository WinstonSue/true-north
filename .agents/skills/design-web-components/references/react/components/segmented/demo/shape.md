# Round shape

## Source

```tsx
import { Moon, Sun } from 'lucide-react'
import React, { useState } from 'react';
;
import { Flex, Segmented } from '@sue/design-web-react';
import type { SegmentedProps } from '@sue/design-web-react';

type SizeType = NonNullable<SegmentedProps['size']>;

const Demo: React.FC = () => {
  const [size, setSize] = useState<SizeType>('medium');
  return (
    <Flex gap="small" align="flex-start" vertical>
      <Segmented<SizeType> options={['small', 'medium', 'large']} value={size} onChange={setSize} />
      <Segmented
        size={size}
        shape="round"
        options={[
          { value: 'light', icon: <Sun  /> },
          { value: 'dark', icon: <Moon  /> },
        ]}
      />
    </Flex>
  );
};

export default Demo;
```
