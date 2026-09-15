'use client';

import { Flex } from '@sue/design-web-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import styles from './TabsPage.module.less';

export type TabsPageItem = {
  name: string;
  href?: string;
  key?: string;
  active?: boolean;
};

export default function TabsPage(props: {
  tabs: TabsPageItem[];
  onSelect?: (tab: TabsPageItem) => void;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex container="fixed" className={styles.tabBar}>
        <Flex container="fill" className={styles.tabs} align="center" gap={4}>
          {props.tabs.map((tab) => (
            <Flex
              key={tab.key || tab.href || tab.name}
              align="center"
              className={clsx(styles.tab, {
                [styles.tabActive]: tab.active,
              })}
              onClick={() => {
                if (tab.active) return;
                if (props.onSelect) {
                  props.onSelect(tab);
                  return;
                }
                if (tab.href) navigate(tab.href);
              }}
            >
              {tab.name}
            </Flex>
          ))}
        </Flex>
        {props.extra && (
          <Flex
            container="fixed"
            justify="end"
            align="center"
          >
            {props.extra}
          </Flex>
        )}
      </Flex>

      <Flex container="fill" className={styles.content}>
        {props.children}
      </Flex>
    </Flex>
  );
}
