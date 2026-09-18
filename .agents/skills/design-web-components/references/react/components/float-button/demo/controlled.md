# Controlled mode

## Source

```tsx
import { Headset, MessageSquare } from 'lucide-react'
import React, { useState } from 'react';
;
import { FloatButton, Switch } from '@sue/design-web-react';

const App: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <>
      <Switch onChange={setOpen} checked={open} style={{ margin: 16 }} />
      <FloatButton.Group
        open={open}
        trigger="click"
        style={{ insetInlineEnd: 24 }}
        icon={<Headset  />}
      >
        <FloatButton />
        <FloatButton />
        <FloatButton icon={<MessageSquare  />} />
      </FloatButton.Group>
      <FloatButton.Group
        open={open}
        shape="square"
        trigger="click"
        style={{ insetInlineEnd: 88 }}
        icon={<Headset  />}
      >
        <FloatButton />
        <FloatButton />
        <FloatButton icon={<MessageSquare  />} />
      </FloatButton.Group>
    </>
  );
};

export default App;
```
