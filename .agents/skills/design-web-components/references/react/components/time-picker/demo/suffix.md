# Prefix and Suffix

## Source

```tsx
import { Smile } from 'lucide-react'
import React from 'react';
;
import { Space, TimePicker } from '@sue/design-web-react';
import type { TimePickerProps } from '@sue/design-web-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <TimePicker
      suffixIcon={<Smile  />}
      onChange={onChange}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
    />
    <TimePicker prefix={<Smile  />} />
    <TimePicker.RangePicker prefix={<Smile  />} />
  </Space>
);

export default App;
```
