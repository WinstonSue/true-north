# Multi-line watermark

## Source

```tsx
import React from 'react';
import { Watermark } from '@sue/design-web-react';

const App: React.FC = () => (
  <Watermark content={['Ant Design', { text: 'Happy Working', font: { fontSize: 12 } }]}>
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
```
