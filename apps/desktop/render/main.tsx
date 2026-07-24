import 'reflect-metadata';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider, Message } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import './style/tailwind.css';
import './style/global.less';
import { HashRouter } from 'react-router-dom';
import rootReducer from './store';
import { GlobalContext } from './context';
import checkLogin from './utils/checkLogin';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock';
import Router from './router';
import { generatePermission } from './router/routes';
import 'dayjs/locale/zh-cn';
import '@true-north/share-types';
import dayjs from 'dayjs';

import { registerMessage } from '@true-north/web-service';

registerMessage({
  error: (params: string) => {
    Message.error(params);
  },
  success: (params: string) => {
    Message.success(params);
  },
  warning: (params: string) => {
    Message.warning(params);
  },
  info: (params: string) => {
    Message.info(params);
  },
});

dayjs.locale('zh-cn');

const store = createStore(rootReducer);

if (process.env.NODE_ENV === 'development') {
  document.title = '知止 True North - Development';
} else {
  document.title = '知止 True North';
}

function LifeToolkitApp() {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  function getArcoLocale() {
    switch (lang) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  function fetchUserInfo() {
    store.dispatch({
      type: 'update-userInfo',
      payload: { userLoading: true },
    });
    store.dispatch({
      type: 'update-userInfo',
      payload: {
        userInfo: {
          name: 'admin',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端开发工程师',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '王力群并非是一个真实存在的人。',
          personalWebsite: 'https://www.arco.design',
          verified: true,
          phoneNumber: /177[*]{6}[0-9]{2}/,
          accountId: /[a-z]{4}[-][0-9]{8}/,
          registrationTime: '2024-01-01 00:00:00',
          permissions: generatePermission('admin'),
        },
        userLoading: false,
      },
    });
  }

  useEffect(() => {
    if (checkLogin()) {
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ConfigProvider
        locale={getArcoLocale()}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Router />
            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  backgroundColor: 'rgba(255, 0, 0, 0.7)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  zIndex: 9999,
                }}
              >
                测试环境
              </div>
            )}
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </HashRouter>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<LifeToolkitApp />);
