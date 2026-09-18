# Icon Placement

## Source

```tsx
import { Search as SearchIcon } from 'lucide-react'
import React, { useState } from 'react';
;
import { Button, Divider, Flex, Radio, Space, Tooltip } from '@sue/design-web-react';

const App: React.FC = () => {
  const [position, setPosition] = useState<'start' | 'end'>('end');

  return (
    <>
      <Space>
        <Radio.Group value={position} onChange={(e) => setPosition(e.target.value)}>
          <Radio.Button value="start">start</Radio.Button>
          <Radio.Button value="end">end</Radio.Button>
        </Radio.Group>
      </Space>
      <Divider titlePlacement="start" plain>
        Preview
      </Divider>
      <Flex gap="small" vertical>
        <Flex wrap gap="small">
          <Tooltip title="search">
            <Button type="primary" shape="circle" icon={<SearchIcon  />} />
          </Tooltip>
          <Button type="primary" shape="circle">
            A
          </Button>
          <Button type="primary" icon={<SearchIcon  />} iconPlacement={position}>
            Search
          </Button>
          <Tooltip title="search">
            <Button shape="circle" icon={<SearchIcon  />} />
          </Tooltip>
          <Button icon={<SearchIcon  />} iconPlacement={position}>
            Search
          </Button>
        </Flex>
        <Flex wrap gap="small">
          <Tooltip title="search">
            <Button shape="circle" icon={<SearchIcon  />} />
          </Tooltip>
          <Button icon={<SearchIcon  />} type="text" iconPlacement={position}>
            Search
          </Button>
          <Tooltip title="search">
            <Button type="dashed" shape="circle" icon={<SearchIcon  />} />
          </Tooltip>
          <Button type="dashed" icon={<SearchIcon  />} iconPlacement={position}>
            Search
          </Button>
          <Button
            icon={<SearchIcon  />}
            href="https://www.google.com"
            target="_blank"
            iconPlacement={position}
          />
          <Button type="primary" loading iconPlacement={position}>
            Loading
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default App;
```
