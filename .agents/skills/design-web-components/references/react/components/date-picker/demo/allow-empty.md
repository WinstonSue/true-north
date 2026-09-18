# Allow Empty

## Source

```tsx
import React from 'react';
import { DatePicker } from '@sue/design-web-react';

const App: React.FC = () => (
  <DatePicker.RangePicker
    placeholder={['Start Date', 'Till Now']}
    allowEmpty={[false, true]}
    onChange={(date, dateString) => {
      console.log(date, dateString);
    }}
  />
);

export default App;
```
