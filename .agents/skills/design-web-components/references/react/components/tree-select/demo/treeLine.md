# Show Tree Line

## Source

```tsx
import { ClipboardCheck } from 'lucide-react'
import React, { useState } from 'react';
;
import { Space, Switch, TreeSelect } from '@sue/design-web-react';

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    icon: <ClipboardCheck  />,
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        icon: <ClipboardCheck  />,
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
            icon: <ClipboardCheck  />,
          },
          {
            value: 'leaf2',
            title: 'leaf2',
            icon: <ClipboardCheck  />,
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        icon: <ClipboardCheck  />,
        children: [
          {
            value: 'sss',
            title: 'sss',
            icon: <ClipboardCheck  />,
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [treeLine, setTreeLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);

  return (
    <Space vertical>
      <Switch
        checkedChildren="showIcon"
        unCheckedChildren="showIcon"
        checked={showIcon}
        onChange={() => setShowIcon(!showIcon)}
      />
      <Switch
        checkedChildren="treeLine"
        unCheckedChildren="treeLine"
        checked={treeLine}
        onChange={() => setTreeLine(!treeLine)}
      />
      <Switch
        disabled={!treeLine}
        checkedChildren="showLeafIcon"
        unCheckedChildren="showLeafIcon"
        checked={showLeafIcon}
        onChange={() => setShowLeafIcon(!showLeafIcon)}
      />
      <TreeSelect
        treeLine={treeLine && { showLeafIcon }}
        style={{ width: 300 }}
        treeData={treeData}
        treeIcon={showIcon}
      />
    </Space>
  );
};

export default App;
```
