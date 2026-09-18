# Icon

## Source

```tsx
import { Search as SearchIcon } from 'lucide-react'
import React from 'react';
;
import { Button, Flex, Tooltip } from '@sue/design-web-react';

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Flex wrap gap="small">
      <Tooltip title="search">
        <Button type="primary" shape="circle" icon={<SearchIcon  />} />
      </Tooltip>
      <Button type="primary" shape="circle">
        A
      </Button>
      <Button type="primary" icon={<SearchIcon  />}>
        Search
      </Button>
      <Tooltip title="search">
        <Button shape="circle" icon={<SearchIcon  />} />
      </Tooltip>
      <Button icon={<SearchIcon  />}>Search</Button>
    </Flex>
    <Flex wrap gap="small">
      <Tooltip title="search">
        <Button shape="circle" icon={<SearchIcon  />} />
      </Tooltip>
      <Button icon={<SearchIcon  />}>Search</Button>
      <Tooltip title="search">
        <Button type="dashed" shape="circle" icon={<SearchIcon  />} />
      </Tooltip>
      <Button type="dashed" icon={<SearchIcon  />}>
        Search
      </Button>
      <Button icon={<SearchIcon  />} href="https://www.google.com" target="_blank" />
    </Flex>
  </Flex>
);

export default App;
```
