# 12 hours

## Source

```tsx
import React from 'react';
import type { TimePickerProps } from '@sue/design-web-react';
import { Space, TimePicker } from '@sue/design-web-react';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space wrap>
    <TimePicker use12Hours onChange={onChange} />
    <TimePicker use12Hours format="h:mm:ss A" onChange={onChange} />
    <TimePicker use12Hours format="h:mm a" onChange={onChange} />
  </Space>
);

export default App;
```
