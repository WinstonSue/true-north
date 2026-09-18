import type { ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';
import styles from './SettingsGroup.module.less';

export function SettingsGroup(props: { children: ReactNode; title?: ReactNode; description?: ReactNode }) {
  return (
    <Flex vertical gap={8} className={styles.wrap}>
      {props.title ? <h2 className={styles.title}>{props.title}</h2> : null}
      {props.description ? <p className={styles.description}>{props.description}</p> : null}
      <div className={styles.group}>{props.children}</div>
    </Flex>
  );
}

export function SettingsRow(props: { label: ReactNode; children: ReactNode }) {
  return (
    <Flex className={styles.row} align="center" justify="space-between" gap={16}>
      <div className={styles.rowLabel}>{props.label}</div>
      <div className={styles.rowControl}>{props.children}</div>
    </Flex>
  );
}
