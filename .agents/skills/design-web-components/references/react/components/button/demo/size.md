# Size

## Source

```tsx
import { Download } from 'lucide-react'
import React, { useState } from 'react';
;
import { Button, Divider, Flex, Radio } from '@sue/design-web-react';
import type { ConfigProviderProps } from '@sue/design-web-react';

type SizeType = ConfigProviderProps['componentSize'];

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('large'); // default is 'medium'
  return (
    <>
      <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="medium">Medium</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <Divider titlePlacement="start" plain>
        Preview
      </Divider>
      <Flex gap="small" align="flex-start" vertical>
        <Flex gap="small" wrap>
          <Button type="primary" size={size}>
            Primary
          </Button>
          <Button size={size}>Default</Button>
          <Button type="dashed" size={size}>
            Dashed
          </Button>
        </Flex>
        <Button type="link" size={size}>
          Link
        </Button>
        <Flex gap="small" wrap>
          <Button type="primary" icon={<Download  />} size={size} />
          <Button type="primary" shape="circle" icon={<Download  />} size={size} />
          <Button type="primary" shape="round" icon={<Download  />} size={size} />
          <Button type="primary" shape="round" icon={<Download  />} size={size}>
            Download
          </Button>
          <Button type="primary" icon={<Download  />} size={size}>
            Download
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default App;
```
