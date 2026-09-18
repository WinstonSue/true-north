# Double-clicked reset

## Source

```tsx
import React, { useState } from 'react';
import { Flex, Splitter } from '@sue/design-web-react';

const defaultSizes = ['30%', '40%', '30%'];

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <h5 style={{ margin: 0, fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
      Panel {props.text}
    </h5>
  </Flex>
);

const App: React.FC = () => {
  const [sizes, setSizes] = useState<(number | string)[]>(defaultSizes);

  const handleDoubleClick = () => {
    setSizes(defaultSizes);
  };

  return (
    <Splitter
      style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      onResize={setSizes}
      onDraggerDoubleClick={handleDoubleClick}
    >
      <Splitter.Panel size={sizes[0]}>
        <Desc text={1} />
      </Splitter.Panel>

      <Splitter.Panel size={sizes[1]}>
        <Desc text={2} />
      </Splitter.Panel>

      <Splitter.Panel size={sizes[2]}>
        <Desc text={3} />
      </Splitter.Panel>
    </Splitter>
  );
};

export default App;
```
