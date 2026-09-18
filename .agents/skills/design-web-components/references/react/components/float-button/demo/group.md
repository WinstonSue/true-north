# FloatButton Group

## Source

```tsx
import { CircleHelp, RefreshCw } from 'lucide-react'
import React from 'react';
;
import { FloatButton } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
      <FloatButton icon={<CircleHelp  />} />
      <FloatButton />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
    <FloatButton.Group shape="square" style={{ insetInlineEnd: 94 }}>
      <FloatButton icon={<CircleHelp  />} />
      <FloatButton />
      <FloatButton icon={<RefreshCw  />} />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
  </>
);

export default App;
```
