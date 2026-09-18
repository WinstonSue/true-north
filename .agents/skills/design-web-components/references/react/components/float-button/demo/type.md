# Type

## Source

```tsx
import { CircleHelp } from 'lucide-react'
import React from 'react';
;
import { FloatButton } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <FloatButton icon={<CircleHelp  />} type="primary" style={{ insetInlineEnd: 24 }} />
    <FloatButton icon={<CircleHelp  />} type="default" style={{ insetInlineEnd: 94 }} />
  </>
);

export default App;
```
