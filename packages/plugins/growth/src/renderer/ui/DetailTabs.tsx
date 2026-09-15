import { Tabs } from '@sue/design-web-react';
import type { ReactNode } from 'react';
import styles from './DetailTabs.module.less';

export function DetailTabs(props: {
  activeKey: string;
  onChange: (key: string) => void;
  items: Array<{ key: string; label: ReactNode; children: ReactNode }>;
}) {
  return (
    <Tabs
      size="small"
      activeKey={props.activeKey}
      onChange={props.onChange}
      className={styles.tabs}
      items={props.items}
    />
  );
}
