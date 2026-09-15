import { useState, type ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import styles from './SplitPane.module.less';

export function SplitPane(props: {
  aside: ReactNode;
  children: ReactNode;
  asideLabel?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Flex container="full" className={styles.split}>
      <Flex
        vertical
        container="fixed"
        className={`${styles.aside}${collapsed ? ` ${styles.asideCollapsed}` : ''}`}
      >
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? `展开${props.asideLabel || '侧栏'}` : `收起${props.asideLabel || '侧栏'}`}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        {collapsed ? null : <div className={styles.asideBody}>{props.aside}</div>}
      </Flex>
      <Flex vertical container="fill" className={styles.main}>
        {props.children}
      </Flex>
    </Flex>
  );
}
