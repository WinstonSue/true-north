import React from 'react';
import {
  Card,
  Divider,
  message,
  FileOutlined,
  MobileOutlined,
  SettingOutlined,
} from '@sue/design-web-react';
import { DatabaseOutlined, FireOutlined } from '@ant-design/icons';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/shortcuts.module.less';
function Shortcuts() {
  const t = useLocale(locale);
  const shortcuts = [
  {
    title: t['workplace.contentMgmt'],
    key: 'Content Management',
    icon: <FileOutlined />
  },
  {
    title: t['workplace.contentStatistic'],
    key: 'Content Statistic',
    icon: <DatabaseOutlined />
  },
  {
    title: t['workplace.advancedMgmt'],
    key: 'Advanced Management',
    icon: <SettingOutlined />
  },
  {
    title: t['workplace.onlinePromotion'],
    key: 'Online Promotion',
    icon: <MobileOutlined />
  },
  {
    title: t['workplace.marketing'],
    key: 'Marketing',
    icon: <FireOutlined />
  }];

  const recentShortcuts = [
  {
    title: t['workplace.contentStatistic'],
    key: 'Content Statistic',
    icon: <DatabaseOutlined />
  },
  {
    title: t['workplace.contentMgmt'],
    key: 'Content Management',
    icon: <FileOutlined />
  },
  {
    title: t['workplace.advancedMgmt'],
    key: 'Advanced Management',
    icon: <SettingOutlined />
  }];

  function onClickShortcut(key) {
    message.info({
      content:
      <span>
          You clicked <b>{key}</b>
        </span>

    });
  }
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h6 className="text-title-1 font-medium">
          {t['workplace.shortcuts']}
        </h6>
        <a style={{ color: "var(--color-primary-6)" }}>{t['workplace.seeMore']}</a>
      </div>
      <div className={styles.shortcuts}>
        {shortcuts.map((shortcut) =>
        <div
          className={styles.item}
          key={shortcut.key}
          onClick={() => onClickShortcut(shortcut.key)}>

            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        )}
      </div>
      <Divider />
      <div className={styles.recent}>{t['workplace.recent']}</div>
      <div className={styles.shortcuts}>
        {recentShortcuts.map((shortcut) =>
        <div
          className={styles.item}
          key={shortcut.key}
          onClick={() => onClickShortcut(shortcut.key)}>

            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        )}
      </div>
    </Card>);

}
export default Shortcuts;