import type { ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';
import { PageHeader } from './PageHeader';
import { SplitPane } from './SplitPane';
import styles from './AgendaPage.module.less';

export function AgendaPage(props: {
  calendar: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <SplitPane aside={props.calendar} asideLabel="日程月历">
      <PageHeader title={props.title} />
      <Flex container="fill" className={styles.content}>
        {props.children}
      </Flex>
    </SplitPane>
  );
}
