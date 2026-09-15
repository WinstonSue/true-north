import type { ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';
import { PageHeader } from './PageHeader';
import styles from './GrowthPage.module.less';
import './tokens.less';

export function GrowthPage(props: {
  title?: ReactNode;
  extra?: ReactNode;
  compactNav?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Flex vertical container="full" className={styles.page}>
      <PageHeader title={props.title} extra={props.extra} />
      {props.compactNav ? <div className={styles.compactNav}>{props.compactNav}</div> : null}
      <Flex vertical container="fill" className={styles.body}>
        {props.children}
      </Flex>
    </Flex>
  );
}
