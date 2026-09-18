# Menu mode

## Source

```tsx
import { Headset, MessageSquare } from 'lucide-react'
import React from 'react';
;
import { FloatButton } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{ insetInlineEnd: 24 }}
      icon={<Headset  />}
    >
      <FloatButton />
      <FloatButton icon={<MessageSquare  />} />
    </FloatButton.Group>
    <FloatButton.Group
      trigger="hover"
      type="primary"
      style={{ insetInlineEnd: 94 }}
      icon={<Headset  />}
    >
      <FloatButton />
      <FloatButton icon={<MessageSquare  />} />
    </FloatButton.Group>
  </>
);

export default App;
```
