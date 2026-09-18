# Control collapsible icons

## Source

```tsx
import React, { useState } from 'react';
import { Flex, Radio, Splitter } from '@sue/design-web-react';
import type { RadioChangeEvent } from '@sue/design-web-react';
import type { CheckboxGroupProps } from '@sue/design-web-react/checkbox';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <h5 style={{ margin: 0, fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
      {props.text}
    </h5>
  </Flex>
);

const options: CheckboxGroupProps<'auto' | boolean>['options'] = [
  { label: 'Auto', value: 'auto' },
  { label: 'True', value: true },
  { label: 'False', value: false },
];

const App: React.FC = () => {
  const [showIconMode, setShowIconMode] = useState<'auto' | boolean>(true);

  const onChange = (e: RadioChangeEvent) => {
    setShowIconMode(e.target.value);
  };

  return (
    <Flex vertical gap={20}>
      <Flex gap={5}>
        <p>ShowCollapsibleIcon: </p>
        <Radio.Group options={options} value={showIconMode} onChange={onChange} />
      </Flex>
      <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Splitter.Panel
          collapsible={{ start: true, end: true, showCollapsibleIcon: showIconMode }}
          min="20%"
        >
          <Desc text="First" />
        </Splitter.Panel>
        <Splitter.Panel collapsible={{ start: true, end: true, showCollapsibleIcon: showIconMode }}>
          <Desc text="Second" />
        </Splitter.Panel>
        <Splitter.Panel collapsible={{ start: true, end: true, showCollapsibleIcon: showIconMode }}>
          <Desc text="Third" />
        </Splitter.Panel>
      </Splitter>
    </Flex>
  );
};

export default App;
```
