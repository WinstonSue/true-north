# Custom semantic dom styling

## Source

```tsx
import { Cloud, Rocket, Zap } from 'lucide-react'
import React from 'react';
;
import { Flex, Segmented } from '@sue/design-web-react';
import type { GetProp, SegmentedProps } from '@sue/design-web-react';
import { createStaticStyles } from 'antd-style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 2px;
  `,
}));

const styleFn: SegmentedProps['styles'] = (info): GetProp<SegmentedProps, 'styles', 'Return'> => {
  if (info.props.vertical) {
    return {
      root: {
        border: '1px solid #77BEF0',
        padding: 4,
        width: 100,
      },
      icon: {
        color: '#77BEF0',
      },
      item: {
        textAlign: 'start',
      },
    };
  }
  return {};
};

const styles: SegmentedProps['styles'] = {
  root: {
    padding: 4,
    width: 260,
  },
};

const options: SegmentedProps['options'] = [
  {
    label: 'Boost',
    value: 'boost',
    icon: <Rocket  />,
  },
  {
    label: 'Stream',
    value: 'stream',
    icon: <Zap  />,
  },
  {
    label: 'Cloud',
    value: 'cloud',
    icon: <Cloud  />,
  },
];

const App: React.FC = () => {
  const segmentedSharedProps: SegmentedProps = {
    options,
    classNames,
  };

  return (
    <Flex vertical gap="medium">
      <Segmented {...segmentedSharedProps} styles={styles} />
      <Segmented {...segmentedSharedProps} styles={styleFn} vertical />
    </Flex>
  );
};

export default App;
```
