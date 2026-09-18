# Customize icon

## Source

```tsx
import { CircleHelp } from 'lucide-react'
import React from 'react';
;
import { Button, Popconfirm } from '@sue/design-web-react';

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    icon={<CircleHelp style={{ color: 'red' }} />}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
```
