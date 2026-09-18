# Change on scroll

## Source

```tsx
import React from 'react';
import type { TimePickerProps } from '@sue/design-web-react';
import { TimePicker } from '@sue/design-web-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker onChange={onChange} changeOnScroll needConfirm={false} />;

export default App;
```
