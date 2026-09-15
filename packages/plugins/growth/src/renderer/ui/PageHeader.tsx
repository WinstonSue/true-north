import type { ReactNode } from 'react';
import { Button, Flex } from '@sue/design-web-react';
import { ChevronLeft } from 'lucide-react';
import styles from './PageHeader.module.less';

export function PageHeader(props: {
  title?: ReactNode;
  extra?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}) {
  if (!props.title && !props.extra && !props.onBack) return null;

  return (
    <Flex container="fixed" align="center" justify="space-between" gap={12} className={styles.header}>
      <Flex align="center" gap={8} className={styles.lead}>
        {props.onBack ? (
          <Button type="text" icon={<ChevronLeft size={16} />} onClick={props.onBack}>
            {props.backLabel || '返回'}
          </Button>
        ) : null}
        {props.title ? <h1 className={styles.title}>{props.title}</h1> : <span />}
      </Flex>
      {props.extra ? <div className={styles.extra}>{props.extra}</div> : null}
    </Flex>
  );
}
