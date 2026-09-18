# Basic

## Source

```tsx
import React from 'react';
import type { InputNumberProps } from '@sue/design-web-react';
import { InputNumber } from '@sue/design-web-react';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;

export default App;
```
