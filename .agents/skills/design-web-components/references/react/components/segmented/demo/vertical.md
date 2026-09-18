# Vertical Direction

## Source

```tsx
import { LayoutGrid, Menu as MenuIcon } from 'lucide-react'
import React from 'react';
;
import { Segmented } from '@sue/design-web-react';

const Demo: React.FC = () => (
  <Segmented
    orientation="vertical"
    options={[
      { value: 'List', icon: <MenuIcon  /> },
      { value: 'Kanban', icon: <LayoutGrid  /> },
    ]}
  />
);

export default Demo;
```
