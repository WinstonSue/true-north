import { Empty, Flex, Spin } from '@sue/design-web-react';
import styles from './EmptyState.module.less';

export function EmptyState(props: { description: string }) {
  return (
    <Flex container="full" align="center" justify="center" className={styles.state}>
      <Empty description={props.description} />
    </Flex>
  );
}

export function LoadingState() {
  return (
    <Flex container="full" align="center" justify="center" className={styles.state}>
      <Spin />
    </Flex>
  );
}
