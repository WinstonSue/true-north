# Dynamic

## Source

```tsx
import { Minus, Plus } from 'lucide-react'
import React, { useState } from 'react';
;
import { Button, Flex, Progress, Space } from '@sue/design-web-react';

const App: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);

  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 10;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };

  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 10;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
  };

  return (
    <Flex vertical gap="small">
      <Flex vertical gap="small">
        <Progress percent={percent} type="line" />
        <Progress percent={percent} type="circle" />
      </Flex>
      <Space.Compact>
        <Button onClick={decline} icon={<Minus  />} />
        <Button onClick={increase} icon={<Plus  />} />
      </Space.Compact>
    </Flex>
  );
};

export default App;
```
