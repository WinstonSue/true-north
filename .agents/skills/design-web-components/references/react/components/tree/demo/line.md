# Tree with line

## Source

```tsx
import { Check, ClipboardCheck, NotebookPen } from 'lucide-react'
import React, { useState } from 'react';
;
import { Select, Switch, Tree } from '@sue/design-web-react';
import type { TreeDataNode } from '@sue/design-web-react';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <ClipboardCheck  />,
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        icon: <ClipboardCheck  />,
        children: [
          { title: 'leaf', key: '0-0-0-0', icon: <ClipboardCheck  /> },
          {
            title: (
              <>
                <div>multiple line title</div>
                <div>multiple line title</div>
              </>
            ),
            key: '0-0-0-1',
            icon: <ClipboardCheck  />,
          },
          { title: 'leaf', key: '0-0-0-2', icon: <ClipboardCheck  /> },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        icon: <ClipboardCheck  />,
        children: [{ title: 'leaf', key: '0-0-1-0', icon: <ClipboardCheck  /> }],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        icon: <ClipboardCheck  />,
        children: [
          { title: 'leaf', key: '0-0-2-0', icon: <ClipboardCheck  /> },
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: <ClipboardCheck  />,
            switcherIcon: <NotebookPen  />,
          },
        ],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '0-1',
    icon: <ClipboardCheck  />,
    children: [
      {
        title: 'parent 2-0',
        key: '0-1-0',
        icon: <ClipboardCheck  />,
        children: [
          { title: 'leaf', key: '0-1-0-0', icon: <ClipboardCheck  /> },
          { title: 'leaf', key: '0-1-0-1', icon: <ClipboardCheck  /> },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [showLine, setShowLine] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [showLeafIcon, setShowLeafIcon] = useState<React.ReactNode>(true);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const handleLeafIconChange = (value: 'true' | 'false' | 'custom') => {
    if (value === 'custom') {
      return setShowLeafIcon(<Check  />);
    }

    if (value === 'true') {
      return setShowLeafIcon(true);
    }

    return setShowLeafIcon(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        showLine: <Switch checked={!!showLine} onChange={setShowLine} />
        <br />
        <br />
        showIcon: <Switch checked={showIcon} onChange={setShowIcon} />
        <br />
        <br />
        showLeafIcon:{' '}
        <Select
          defaultValue="true"
          onChange={handleLeafIconChange}
          options={[
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' },
            { label: 'Custom icon', value: 'custom' },
          ]}
        />
      </div>
      <Tree
        showLine={showLine ? { showLeafIcon } : false}
        showIcon={showIcon}
        defaultExpandedKeys={['0-0-0']}
        onSelect={onSelect}
        treeData={treeData}
      />
    </div>
  );
};

export default App;
```
