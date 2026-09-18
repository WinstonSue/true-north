# Customize Icon

## Source

```tsx
import { ChevronDown, Frown, Meh, Smile } from 'lucide-react'
import React from 'react';
;
import { Tree } from '@sue/design-web-react';
import type { TreeDataNode } from '@sue/design-web-react';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <Smile  />,
    children: [
      {
        title: 'leaf',
        key: '0-0-0',
        icon: <Meh  />,
      },
      {
        title: 'leaf',
        key: '0-0-1',
        icon: ({ selected }) => (selected ? <Frown  /> : <Frown  />),
      },
    ],
  },
];

const App: React.FC = () => (
  <Tree
    showIcon
    defaultExpandAll
    defaultSelectedKeys={['0-0-0']}
    switcherIcon={<ChevronDown  />}
    treeData={treeData}
  />
);

export default App;
```
