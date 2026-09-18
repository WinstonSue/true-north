# With Icon

## Source

```tsx
import { LayoutGrid, Menu as MenuIcon } from 'lucide-react'
import React from 'react';
;
import { Segmented } from '@sue/design-web-react';

const Demo: React.FC = () => (
  <Segmented
    options={[
      { label: 'List', value: 'List', icon: <MenuIcon  /> },
      { label: 'Kanban', value: 'Kanban', icon: <LayoutGrid  /> },
    ]}
  />
);

export default Demo;
```
