# Hour and minute

## Source

```tsx
import React from 'react';
import { TimePicker } from '@sue/design-web-react';
import dayjs from 'dayjs';

const format = 'HH:mm';

const App: React.FC = () => <TimePicker defaultValue={dayjs('12:08', format)} format={format} />;

export default App;
```
