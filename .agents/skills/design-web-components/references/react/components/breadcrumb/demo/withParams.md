# With Params

## Source

```tsx
import React from 'react';
import { Breadcrumb } from '@sue/design-web-react';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'Users',
      },
      {
        title: ':id',
        href: '',
      },
    ]}
    params={{ id: 1 }}
  />
);

export default App;
```
