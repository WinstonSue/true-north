# Locale text

## Source

```tsx
import React from 'react';
import { Button, Popconfirm } from '@sue/design-web-react';

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    okText="Yes"
    cancelText="No"
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
```
