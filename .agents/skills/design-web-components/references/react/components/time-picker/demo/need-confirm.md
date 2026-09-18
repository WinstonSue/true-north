# Need Confirm

## Source

```tsx
import React from 'react';
import type { TimePickerProps } from '@sue/design-web-react';
import { TimePicker } from '@sue/design-web-react';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker onChange={onChange} needConfirm />;

export default App;
```
