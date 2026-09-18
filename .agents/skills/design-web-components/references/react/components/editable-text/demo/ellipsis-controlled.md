# Controlled ellipsis expand/collapse

## Source

```tsx
import React, { useState } from 'react';
import { EditableParagraph, Flex, Slider, Switch } from '@sue/design-web-react';

const App: React.FC = () => {
  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);

  return (
    <Flex gap={16} vertical>
      <Flex gap={16} align="center">
        <Switch
          checked={expanded}
          onChange={setExpanded}
          style={{ flex: 'none' }}
        />
        <Slider min={1} max={20} value={rows} onChange={setRows} style={{ flex: 'auto' }} />
      </Flex>

      <EditableParagraph
        ellipsis={{
          rows,
          expandable: 'collapsible',
          expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
        }}
        copyable
      >
        {'Antdv Next, a design language for background applications, is refined by Ant UED Team.'.repeat(
          20,
        )}
      </EditableParagraph>
    </Flex>
  );
};

export default App;
```
