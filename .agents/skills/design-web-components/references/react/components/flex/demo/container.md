# container

## Source

```tsx
import React from 'react';
import { Flex } from '@sue/design-web-react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(() => ({
  shell: {
    height: 96,
    padding: 8,
    border: '1px solid #d9d9d9',
  },
  outer: {
    width: '100%',
    height: 96,
    padding: 8,
    border: '1px dashed #91caff',
  },
  panel: {
    padding: 12,
    border: '1px solid #91caff',
    borderRadius: 6,
    background: '#e6f4ff',
  },
  fixed: {
    width: 120,
    background: '#fff7e6',
    borderColor: '#ffd591',
  },
  fill: {
    background: '#e6f4ff',
  },
  full: {
    background: '#f6ffed',
    borderColor: '#b7eb8f',
  },
}));

const App: React.FC = () => {
  const { styles } = useStyles();

  return (
    <Flex vertical gap="medium">
      <Flex gap="medium" className={styles.shell}>
        <Flex
          container="fixed"
          align="center"
          justify="center"
          className={`${styles.panel} ${styles.fixed}`}
        >
          fixed
        </Flex>
        <Flex
          container="fill"
          align="center"
          justify="center"
          className={`${styles.panel} ${styles.fill}`}
        >
          fill
        </Flex>
      </Flex>

      <div className={styles.outer}>
        <Flex
          container="full"
          align="center"
          justify="center"
          className={`${styles.panel} ${styles.full}`}
        >
          full
        </Flex>
      </div>
    </Flex>
  );
};

export default App;
```
