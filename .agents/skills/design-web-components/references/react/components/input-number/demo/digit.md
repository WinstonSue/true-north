# High precision decimals

## Source

```tsx
import React from 'react';
import type { InputNumberProps } from '@sue/design-web-react';
import { InputNumber } from '@sue/design-web-react';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => (
  <InputNumber<string>
    style={{ width: 200 }}
    defaultValue="1"
    min="0"
    max="10"
    step="0.00000000000001"
    onChange={onChange}
    stringMode
  />
);

export default App;
```
