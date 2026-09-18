# With an Icon

## Source

```tsx
import { House, User } from 'lucide-react'
import React from 'react';
;
import { Breadcrumb } from '@sue/design-web-react';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        href: '',
        title: <House  />,
      },
      {
        href: '',
        title: (
          <>
            <User  />
            <span>Application List</span>
          </>
        ),
      },
      {
        title: 'Application',
      },
    ]}
  />
);

export default App;
```
