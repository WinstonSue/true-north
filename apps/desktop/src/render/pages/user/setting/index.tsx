import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Tabs } from '@sue/design-web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import InfoHeader from './header';
import InfoForm from './info';
import Security from './security';
import './mock';
import Verified from './verified';

function UserInfo() {
  const t = useLocale(locale);
  const userInfo = useSelector((state: any) => state.userInfo);
  const loading = useSelector((state: any) => state.userLoading);
  const [activeTab, setActiveTab] = useState('basic');
  return (
    <div>
      <Card style={{ padding: '14px 20px' }}>
        <InfoHeader userInfo={userInfo} loading={loading} />
      </Card>
      <Card style={{ marginTop: '16px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'basic',
              label: t['userSetting.title.basicInfo'],
              children: <InfoForm loading={loading} />,
            },
            {
              key: 'security',
              label: t['userSetting.title.security'],
              children: <Security />,
            },
            {
              key: 'verified',
              label: t['userSetting.label.verified'],
              children: <Verified />,
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default UserInfo;
