# Custom semantic dom styling

## Source

```tsx
import { CircleCheck, CircleX } from 'lucide-react'
import React from 'react';
;
import { Flex, Space, Tag } from '@sue/design-web-react';
import type { GetProp, GetProps, TagProps } from '@sue/design-web-react';
import { createStaticStyles } from 'antd-style';

type CheckableTagGroupProps = GetProps<typeof Tag.CheckableTagGroup>;

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 2px 6px;
    border-radius: 4px;
  `,
}));

const styles: TagProps['styles'] = {
  root: {
    backgroundColor: '#e6f7ff',
  },
  icon: {
    color: '#52c41a',
  },
  content: {
    color: '#262626',
  },
};

const stylesFn: TagProps['styles'] = (info): GetProp<TagProps, 'styles', 'Return'> => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        backgroundColor: '#F5EFFF',
      },
      icon: {
        color: '#8F87F1',
      },
      content: {
        color: '#8F87F1',
      },
    };
  }
};

const groupStyles: CheckableTagGroupProps['styles'] = {
  root: {
    gap: 12,
    padding: '8px 12px',
    backgroundColor: 'rgba(82, 196, 26, 0.08)',
    borderRadius: 8,
  },
  item: {
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    borderColor: 'rgba(82, 196, 26, 0.3)',
    color: '#52c41a',
  },
};

const groupStylesFn: CheckableTagGroupProps['styles'] = (
  info,
): GetProp<CheckableTagGroupProps, 'styles', 'Return'> => {
  const { multiple } = info.props;
  if (multiple) {
    return {
      root: {
        gap: 16,
        padding: '8px 12px',
        backgroundColor: 'rgba(143, 135, 241, 0.08)',
        borderRadius: 8,
      },
      item: {
        backgroundColor: 'rgba(143, 135, 241, 0.1)',
        borderColor: 'rgba(143, 135, 241, 0.3)',
        color: '#8F87F1',
        fontWeight: 500,
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  return (
    <Space size="large" vertical>
      <Flex gap="medium">
        <Tag classNames={classNames} styles={styles} icon={<CircleCheck  />}>
          Object
        </Tag>
        <Tag
          variant="filled"
          classNames={classNames}
          styles={stylesFn}
          icon={<CircleX  />}
        >
          Function
        </Tag>
      </Flex>
      <Flex vertical gap="medium">
        <Tag.CheckableTagGroup
          classNames={classNames}
          styles={groupStyles}
          options={['React', 'Vue', 'Angular']}
        />
        <Tag.CheckableTagGroup
          classNames={classNames}
          styles={groupStylesFn}
          options={['meet-student', 'thinkasany']}
          multiple
        />
      </Flex>
    </Space>
  );
};

export default App;
```
