# Collapsible

## Source

```tsx
import React, { useState } from 'react';
import { Flex, Splitter, Switch } from '@sue/design-web-react';
import type { SplitterProps } from '@sue/design-web-react';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <h5 style={{ margin: 0, fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
      {props.text}
    </h5>
  </Flex>
);

const CustomSplitter: React.FC<Readonly<SplitterProps>> = ({ style, ...restProps }) => (
  <Splitter style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', ...style }} {...restProps}>
    <Splitter.Panel collapsible min="20%">
      <Desc text="First" />
    </Splitter.Panel>
    <Splitter.Panel collapsible>
      <Desc text="Second" />
    </Splitter.Panel>
  </Splitter>
);

const App: React.FC = () => {
  const [motion, setMotion] = useState(true);

  return (
    <Flex vertical gap="middle">
      <Flex gap="middle">
        <Switch
          checked={motion}
          onChange={setMotion}
          checkedChildren="motion"
          unCheckedChildren="motion"
        />
      </Flex>
      <CustomSplitter style={{ height: 200 }} collapsible={{ motion }} />
      <CustomSplitter style={{ height: 300 }} orientation="vertical" collapsible={{ motion }} />
    </Flex>
  );
};

export default App;
```
