# Loop Banner

## Source

```tsx
import React from 'react';
import { Alert } from '@sue/design-web-react';
import Marquee from 'react-fast-marquee';

const App: React.FC = () => (
  <Alert
    banner
    title={
      <Marquee pauseOnHover gradient={false}>
        I can be a React component, multiple React components, or just some text.
      </Marquee>
    }
  />
);

export default App;
```
