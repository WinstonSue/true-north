import { DashboardOutlined, ExperimentOutlined, GlobalOutlined, TagOutlined } from '@ant-design/icons';
import { useContext, useEffect } from 'react';
import { Tooltip, Input, Avatar, Dropdown, message, Button, CommentOutlined, LoadingOutlined, MoonOutlined, NotificationOutlined, PoweroffOutlined, SettingOutlined, SunOutlined, UserOutlined } from '@sue/design-web-react';

import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from '@/store';
import { GlobalContext } from '@/context';
import useLocale from '@/utils/useLocale';
import Logo from '@/assets/logo.svg';
import MessageBox from '@/components/MessageBox';
import IconButton from './IconButton';
import Settings from '../Settings';
import styles from './style/index.module.less';
import defaultLocale from '@/locale';
import useStorage from '@/utils/useStorage';
import { generatePermission } from '@/router/routes';

function Navbar({ show }: { show: boolean }) {
  const t = useLocale();
  const { userInfo, userLoading } = useSelector((state: GlobalState) => state);
  const dispatch = useDispatch();

  const [_, setUserStatus] = useStorage('userStatus');
  const [role, setRole] = useStorage('userRole', 'admin');

  const { setLang, lang, theme, setTheme } = useContext(GlobalContext);

  function logout() {
    setUserStatus('logout');
    window.location.href = `/login`;
  }

  function onMenuItemClick(key: string) {
    if (key === 'logout') {
      logout();
    } else if (key === 'switch role') {
      handleChangeRole();
    } else {
      message.info(`You clicked ${key}`);
    }
  }

  useEffect(() => {
    dispatch({
      type: 'update-userInfo',
      payload: {
        userInfo: {
          ...userInfo,
          permissions: generatePermission(role),
        },
      },
    });
  }, [role]);

  if (!show) {
    return (
      <div className={styles['fixed-settings']}>
        <Settings
          trigger={
            <Button icon={<SettingOutlined />} type="primary" size="large" />
          }
        />
      </div>
    );
  }

  const handleChangeRole = () => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    setRole(newRole);
  };

  const userMenu = {
    items: [
      {
        key: 'role',
        label: (
          <span>
            <UserOutlined className={styles['dropdown-icon']} />
            <span className={styles['user-role']}>
              {role === 'admin'
                ? t['menu.user.role.admin']
                : t['menu.user.role.user']}
            </span>
          </span>
        ),
        children: [
          {
            key: 'switch role',
            label: (
              <span>
                <TagOutlined className={styles['dropdown-icon']} />
                {t['menu.user.switchRoles']}
              </span>
            ),
          },
        ],
      },
      {
        key: 'setting',
        label: (
          <span>
            <SettingOutlined className={styles['dropdown-icon']} />
            {t['menu.user.setting']}
          </span>
        ),
      },
      {
        key: 'more',
        label: (
          <span>
            <ExperimentOutlined className={styles['dropdown-icon']} />
            {t['message.seeMore']}
          </span>
        ),
        children: [
          {
            key: 'workplace',
            label: (
              <span>
                <DashboardOutlined className={styles['dropdown-icon']} />
                {t['menu.dashboard.workplace']}
              </span>
            ),
          },
          {
            key: 'card list',
            label: (
              <span>
                <CommentOutlined className={styles['dropdown-icon']} />
                {t['menu.list.cardList']}
              </span>
            ),
          },
        ],
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        label: (
          <span>
            <PoweroffOutlined className={styles['dropdown-icon']} />
            {t['navbar.logout']}
          </span>
        ),
      },
    ],
    onClick: ({ key }: { key: string }) => onMenuItemClick(key),
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Logo />
          <div className={styles['logo-name']}>{t['title']}</div>
        </div>
      </div>
      <ul className={styles.right}>
        <li>
          <Input.Search
            className={styles.round}
            placeholder={t['navbar.search.placeholder']}
          />
        </li>
        <li>
          <Dropdown
            trigger={['hover']}
            placement="bottomRight"
            menu={{
              selectedKeys: [lang],
              items: [
                { key: 'zh-CN', label: '中文' },
                { key: 'en-US', label: 'English' },
              ],
              onClick: ({ key }) => {
                setLang(key);
                const nextLang = defaultLocale[key];
                message.info(`${nextLang['message.lang.tips']}${key}`);
              },
            }}
          >
            <span>
              <IconButton icon={<GlobalOutlined />} />
            </span>
          </Dropdown>
        </li>
        <li>
          <MessageBox>
            <IconButton icon={<NotificationOutlined />} />
          </MessageBox>
        </li>
        <li>
          <Tooltip
            title={
              theme === 'light'
                ? t['settings.navbar.theme.toDark']
                : t['settings.navbar.theme.toLight']
            }
          >
            <IconButton
              icon={theme !== 'dark' ? <MoonOutlined /> : <SunOutlined />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </Tooltip>
        </li>
        <li>
          <Settings />
        </li>
        {userInfo && (
          <li>
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              disabled={userLoading}
            >
              <Avatar size={32} style={{ cursor: 'pointer' }}>
                {userLoading ? (
                  <LoadingOutlined />
                ) : (
                  <img alt="avatar" src={userInfo.avatar} />
                )}
              </Avatar>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
