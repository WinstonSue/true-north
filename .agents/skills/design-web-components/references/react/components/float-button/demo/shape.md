# Shape

## Source

```tsx
import { Headset } from 'lucide-react'
import React from 'react';
;
import { FloatButton } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <FloatButton
      shape="circle"
      type="primary"
      style={{ insetInlineEnd: 94 }}
      icon={<Headset  />}
    />
    <FloatButton
      shape="square"
      type="primary"
      style={{ insetInlineEnd: 24 }}
      icon={<Headset  />}
    />
  </>
);

export default App;
```
