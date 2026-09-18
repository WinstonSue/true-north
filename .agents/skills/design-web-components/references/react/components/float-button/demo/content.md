# Content

## Source

```tsx
import { FileText } from 'lucide-react'
import React from 'react';
;
import { FloatButton } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <FloatButton
      icon={<FileText  />}
      content="HELP INFO"
      shape="square"
      style={{ insetInlineEnd: 24 }}
    />
    <FloatButton content="HELP INFO" shape="square" style={{ insetInlineEnd: 94 }} />
    <FloatButton
      icon={<FileText  />}
      content="HELP"
      shape="square"
      style={{ insetInlineEnd: 164 }}
    />
  </>
);

export default App;
```
