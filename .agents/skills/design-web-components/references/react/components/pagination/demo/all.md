# Show All

## Source

```tsx
import React from 'react';
import { Pagination } from '@sue/design-web-react';

const App: React.FC = () => (
  <Pagination
    total={85}
    showSizeChanger
    showQuickJumper
    showTotal={(total) => `Total ${total} items`}
  />
);

export default App;
```
