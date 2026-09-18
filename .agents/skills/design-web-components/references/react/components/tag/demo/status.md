# Status Tag

## Source

```tsx
import { CircleAlert, CircleCheck, CircleX, Clock, RefreshCw } from 'lucide-react'
import React from 'react';
;
import { Divider, Flex, Tag } from '@sue/design-web-react';

const variants = ['filled', 'solid', 'outlined'] as const;
const presets = [
  { status: 'success', icon: <CircleCheck  /> },
  { status: 'processing', icon: <RefreshCw spin /> },
  { status: 'warning', icon: <CircleAlert  /> },
  { status: 'error', icon: <CircleX  /> },
  { status: 'default', icon: <Clock  /> },
];

const App: React.FC = () => (
  <>
    {variants.map((variant) => (
      <div key={variant}>
        <Divider titlePlacement="start">Status ({variant})</Divider>
        <Flex gap="small" align="center" wrap>
          {presets.map(({ status, icon }) => (
            <Tag key={status} color={status} icon={icon} variant={variant}>
              {status}
            </Tag>
          ))}
        </Flex>
      </div>
    ))}
  </>
);

export default App;
```
