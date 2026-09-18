import type { ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';
import styles from './FilterBar.module.less';

export function FilterBar(props: { children: ReactNode; extra?: ReactNode }) {
  return (
    <Flex container="fixed" align="center" justify="space-between" gap={12} className={styles.bar}>
      <div className={styles.filters}>{props.children}</div>
      {props.extra ? <div className={styles.extra}>{props.extra}</div> : null}
    </Flex>
  );
}
