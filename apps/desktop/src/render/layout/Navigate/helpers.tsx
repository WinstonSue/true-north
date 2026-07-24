import {
  IconDashboard,
  IconList,
  IconSettings,
  IconFile,
  IconApps,
  IconCheckCircle,
  IconExclamationCircle,
  IconUser,
} from '@arco-design/web-react/icon';
import styles from '../layout.module.less';
import { SiteIcon } from '@true-north/components-ui';

export function getIconFromKey(key: string): React.ReactNode {
  switch (key) {
    case '/growth':
      return <SiteIcon id="calendar-sidebar" className={styles.icon} />;
    case '/growth/todo':
      return <SiteIcon id="list-sidebar" className={styles.icon} />;
    case '/dashboard':
      return <IconDashboard className={styles.icon} />;
    case '/list':
      return <IconList className={styles.icon} />;
    case '/form':
      return <IconSettings className={styles.icon} />;
    case '/profile':
      return <IconFile className={styles.icon} />;
    case '/visualization':
      return <IconApps className={styles.icon} />;
    case '/result':
      return <IconCheckCircle className={styles.icon} />;
    case '/exception':
      return <IconExclamationCircle className={styles.icon} />;
    case '/user':
      return <IconUser className={styles.icon} />;
    default:
      return <div className={styles['icon-empty']} />;
  }
}
