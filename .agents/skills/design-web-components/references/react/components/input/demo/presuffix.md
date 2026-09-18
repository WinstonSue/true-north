# prefix and suffix

## Source

```tsx
import { Info, Lock, User } from 'lucide-react'
import React from 'react';
;
import { Input, Tooltip } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <Input
      placeholder="Enter your username"
      prefix={<User style={{ color: 'rgba(0,0,0,.25)' }} />}
      suffix={
        <Tooltip title="Extra information">
          <Info style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
      }
    />
    <br />
    <br />
    <Input prefix="￥" suffix="RMB" />
    <br />
    <br />
    <Input prefix="￥" suffix="RMB" disabled />
    <br />
    <br />
    <Input.Password
      suffix={<Lock  />} // `suffix` available since `5.27.0`
      placeholder="input password support suffix"
    />
  </>
);

export default App;
```
