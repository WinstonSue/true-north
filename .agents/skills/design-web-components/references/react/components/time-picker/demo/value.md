# Under Control

## Source

```tsx
import React, { useState } from 'react';
import { TimePicker } from '@sue/design-web-react';
import type { Dayjs } from 'dayjs';

const App: React.FC = () => {
  const [value, setValue] = useState<Dayjs | null>(null);

  const onChange = (time: Dayjs | null) => {
    setValue(time);
  };

  return <TimePicker value={value} onChange={onChange} />;
};

export default App;
```
