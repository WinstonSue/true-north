# other status

## Source

```tsx
import React from 'react';
import { Flex, QRCode } from '@sue/design-web-react';

const value = 'https://ant.design';

const App: React.FC = () => (
  <Flex gap="medium" wrap>
    <QRCode value={value} status="loading" />
    <QRCode value={value} status="expired" onRefresh={() => console.log('refresh')} />
    <QRCode value={value} status="scanned" />
  </Flex>
);

export default App;
```
