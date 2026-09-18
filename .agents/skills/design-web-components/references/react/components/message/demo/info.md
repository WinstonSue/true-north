# Static method (deprecated)

## Source

```tsx
import React from 'react';
import { Button, message } from '@sue/design-web-react';

const info = () => {
  message.info('This is a normal message');
};

const App: React.FC = () => (
  <Button type="primary" onClick={info}>
    Static Method
  </Button>
);

export default App;
```
