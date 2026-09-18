# Radio Group

## Source

```tsx
import { ChartColumn, ChartLine, ChartPie, ChartScatter } from 'lucide-react'
import React, { useState } from 'react';
;
import type { RadioChangeEvent } from '@sue/design-web-react';
import { Flex, Radio } from '@sue/design-web-react';

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <Radio.Group
      onChange={onChange}
      value={value}
      options={[
        {
          value: 1,
          className: 'option-1',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <ChartLine style={{ fontSize: 18 }} />
              LineChart
            </Flex>
          ),
        },
        {
          value: 2,
          className: 'option-2',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <ChartScatter style={{ fontSize: 18 }} />
              DotChart
            </Flex>
          ),
        },
        {
          value: 3,
          className: 'option-3',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <ChartColumn style={{ fontSize: 18 }} />
              BarChart
            </Flex>
          ),
        },
        {
          value: 4,
          className: 'option-4',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <ChartPie style={{ fontSize: 18 }} />
              PieChart
            </Flex>
          ),
        },
      ]}
    />
  );
};

export default App;
```
