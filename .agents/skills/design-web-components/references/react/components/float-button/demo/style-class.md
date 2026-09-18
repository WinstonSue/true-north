# Custom semantic dom styling

## Source

```tsx
import { CircleHelp } from 'lucide-react'
import React from 'react';
;
import { FloatButton } from '@sue/design-web-react';
import type { FloatButtonProps, GetProp } from '@sue/design-web-react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  root: {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
    borderRadius: token.borderRadius,
    padding: `${token.paddingXS}px ${token.padding}px`,
    height: 'auto',
  },
  content: {
    color: token.colorText,
  },
}));

const stylesObject: FloatButtonProps['styles'] = {
  root: {
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
};

const stylesFn: FloatButtonProps['styles'] = (
  info,
): GetProp<FloatButtonProps, 'styles', 'Return'> => {
  if (info.props.type === 'primary') {
    return {
      root: {
        backgroundColor: '#171717',
      },
      content: {
        color: '#fff',
      },
    };
  }
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();
  return (
    <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 + 70 }}>
      <FloatButton
        type="primary"
        classNames={classNames}
        href="https://ant.design/index-cn"
        styles={stylesFn}
        tooltip={<div>custom style class</div>}
      />
      <FloatButton
        type="default"
        classNames={classNames}
        styles={stylesObject}
        icon={<CircleHelp  />}
      />
    </FloatButton.Group>
  );
};

export default App;
```
