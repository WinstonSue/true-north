# Basic

## Source

```tsx
import React from 'react';
import { Calendar } from '@sue/design-web-react';
import type { CalendarProps } from '@sue/design-web-react';
import type { Dayjs } from 'dayjs';

const App: React.FC = () => {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return <Calendar onPanelChange={onPanelChange} />;
};

export default App;
```
