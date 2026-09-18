# Responsive Size

## Source

```tsx
import { Hexagon } from 'lucide-react'
import React from 'react';
;
import { Avatar } from '@sue/design-web-react';

const App: React.FC = () => (
  <Avatar
    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
    icon={<Hexagon  />}
  />
);

export default App;
```
