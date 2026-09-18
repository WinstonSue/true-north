# Basic

## Source

```tsx
import { CircleX, Trash2 } from 'lucide-react'
import React from 'react';
;
import { Flex, Tag } from '@sue/design-web-react';

const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  console.log('Clicked! But prevent default.');
};

const App: React.FC = () => (
  <Flex gap="small" align="center" wrap>
    <Tag>Tag 1</Tag>
    <Tag>
      <a
        href="https://github.com/ant-design/ant-design/issues/1862"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ant Design issue"
      >
        Link
      </a>
    </Tag>
    <Tag closeIcon onClose={preventDefault}>
      Prevent Default
    </Tag>
    <Tag closeIcon={<CircleX  />} onClose={console.log}>
      Tag 2
    </Tag>
    <Tag
      closable={{
        closeIcon: <Trash2  />,
        'aria-label': 'Close Button',
      }}
      onClose={console.log}
    >
      Tag 3
    </Tag>
  </Flex>
);

export default App;
```
