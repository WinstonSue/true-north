import React from 'react';
import { Card, Divider, message } from '@sue/design-web-react';
import { Typography, Link } from '@true-north/components-ui';
import {
  IconFile,
  IconStorage,
  IconSettings,
  IconMobile,
  IconFire,
} from '@true-north/components-ui';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/shortcuts.module.less';
function Shortcuts() {
  const t = useLocale(locale);
  const shortcuts = [
    {
      title: t['workplace.contentMgmt'],
      key: 'Content Management',
      icon: <IconFile />,
    },
    {
      title: t['workplace.contentStatistic'],
      key: 'Content Statistic',
      icon: <IconStorage />,
    },
    {
      title: t['workplace.advancedMgmt'],
      key: 'Advanced Management',
      icon: <IconSettings />,
    },
    {
      title: t['workplace.onlinePromotion'],
      key: 'Online Promotion',
      icon: <IconMobile />,
    },
    {
      title: t['workplace.marketing'],
      key: 'Marketing',
      icon: <IconFire />,
    },
  ];
  const recentShortcuts = [
    {
      title: t['workplace.contentStatistic'],
      key: 'Content Statistic',
      icon: <IconStorage />,
    },
    {
      title: t['workplace.contentMgmt'],
      key: 'Content Management',
      icon: <IconFile />,
    },
    {
      title: t['workplace.advancedMgmt'],
      key: 'Advanced Management',
      icon: <IconSettings />,
    },
  ];
  function onClickShortcut(key) {
    message.info({
      content: (
        <span>
          You clicked <b>{key}</b>
        </span>
      ),
    });
  }
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6}>
          {t['workplace.shortcuts']}
        </Typography.Title>
        <Link>{t['workplace.seeMore']}</Link>
      </div>
      <div className={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
          <div
            className={styles.item}
            key={shortcut.key}
            onClick={() => onClickShortcut(shortcut.key)}
          >
            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        ))}
      </div>
      <Divider />
      <div className={styles.recent}>{t['workplace.recent']}</div>
      <div className={styles.shortcuts}>
        {recentShortcuts.map((shortcut) => (
          <div
            className={styles.item}
            key={shortcut.key}
            onClick={() => onClickShortcut(shortcut.key)}
          >
            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
export default Shortcuts;
