# Basic

## Source

```tsx
import React from 'react';
import type { DatePickerProps } from '@sue/design-web-react';
import { DatePicker, Flex } from '@sue/design-web-react';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const Demo: React.FC = () => (
  <Flex gap="small" justify="flex-start" align="flex-start" vertical>
    <DatePicker onChange={onChange} />
    <DatePicker onChange={onChange} picker="week" />
    <DatePicker onChange={onChange} picker="month" />
    <DatePicker onChange={onChange} picker="quarter" />
    <DatePicker onChange={onChange} picker="year" />
  </Flex>
);

export default Demo;
```
