# Show Week

## Source

```tsx
import React from 'react';
import { Calendar } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <Calendar fullscreen showWeek />
    <br />
    <Calendar fullscreen={false} showWeek />
  </>
);

export default App;
```
