# Basic

## Source

```tsx
import React from 'react';
import { Switch } from '@sue/design-web-react';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const App: React.FC = () => <Switch defaultChecked onChange={onChange} />;

export default App;
```
