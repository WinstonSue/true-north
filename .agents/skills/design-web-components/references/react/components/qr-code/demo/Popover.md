# Advanced Usage

## Source

```tsx
import React from 'react';
import { Button, Popover, QRCode } from '@sue/design-web-react';

const App: React.FC = () => (
  <Popover content={<QRCode value="https://ant.design" bordered={false} />}>
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
```
