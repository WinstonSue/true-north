# Vertical

## Source

```tsx
import React from 'react';
import { Flex, Splitter } from '@sue/design-web-react';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <h5 style={{ margin: 0, fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
      {props.text}
    </h5>
  </Flex>
);

const App: React.FC = () => (
  <Splitter vertical style={{ height: 300, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
    <Splitter.Panel>
      <Desc text="First" />
    </Splitter.Panel>
    <Splitter.Panel>
      <Desc text="Second" />
    </Splitter.Panel>
  </Splitter>
);

export default App;
```
