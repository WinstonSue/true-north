# Custom semantic dom styling

## Source

```tsx
import React from 'react';
import { Flex, Splitter } from '@sue/design-web-react';
import type { GetProp, SplitterProps } from '@sue/design-web-react';
import { createStaticStyles } from 'antd-style';

const Desc: React.FC<Readonly<{ text?: string | number; style?: React.CSSProperties }>> = (
  props,
) => {
  return (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
      <h5 style={{ margin: 0, fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.45)', ...props.style }}>
        {props.text}
      </h5>
    </Flex>
  );
};

const styles = createStaticStyles(({ css, cssVar }) => ({
  boxShadow: css`
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
}));

const stylesObject: SplitterProps['styles'] = {
  root: { backgroundColor: '#fffbe6' },
  // dragger: { backgroundColor: 'rgba(194,223,252,0.4)' },
  dragger: { default: { backgroundColor: 'rgba(194,223,252,0.4)' } },
};

const stylesFn: SplitterProps['styles'] = ({
  props,
}): GetProp<SplitterProps, 'styles', 'Return'> => {
  if (props.orientation === 'horizontal') {
    return {
      root: {
        borderWidth: 2,
        borderStyle: 'dashed',
        marginBottom: 10,
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const splitSharedProps: SplitterProps = {
    style: { height: 200 },
    classNames: { root: styles.boxShadow },
  };

  return (
    <Flex vertical gap="large">
      <Splitter {...splitSharedProps} styles={stylesObject}>
        <Splitter.Panel>
          <Desc text="First" style={{ color: '#000' }} />
        </Splitter.Panel>
        <Splitter.Panel>
          <Desc text="Second" style={{ color: '#000' }} />
        </Splitter.Panel>
      </Splitter>
      <Splitter {...splitSharedProps} styles={stylesFn}>
        <Splitter.Panel>
          <Desc text="First" />
        </Splitter.Panel>
        <Splitter.Panel>
          <Desc text="Second" />
        </Splitter.Panel>
      </Splitter>
    </Flex>
  );
};

export default App;
```
