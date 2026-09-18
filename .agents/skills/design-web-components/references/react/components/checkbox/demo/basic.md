# Basic

## Source

```tsx
import React from 'react';
import { Checkbox } from '@sue/design-web-react';
import type { CheckboxProps } from '@sue/design-web-react';

const onChange: CheckboxProps['onChange'] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

const App: React.FC = () => <Checkbox onChange={onChange}>Checkbox</Checkbox>;

export default App;
```
