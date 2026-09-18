# No border

## Source

```tsx
import React from 'react';
import { Card } from '@sue/design-web-react';

const App: React.FC = () => (
  <Card title="Card title" variant="borderless" style={{ width: 300 }}>
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
);

export default App;
```
