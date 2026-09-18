# Need Confirm

## Source

```tsx
import React from 'react';
import type { DatePickerProps } from '@sue/design-web-react';
import { DatePicker } from '@sue/design-web-react';
import type { Dayjs } from 'dayjs';

const onChange: DatePickerProps<Dayjs, false>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const App: React.FC = () => <DatePicker onChange={onChange} needConfirm />;

export default App;
```
