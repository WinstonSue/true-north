import React, { useState } from 'react';
import { Divider, Tabs } from '@sue/design-web-react';

import DesktopControllerTab from './DesktopControllerTab';
import ApiControllerTab from './ApiControllerTab';
import WebServiceTab from './WebServiceTab';

const DevToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DesktopControllerDiff');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 className="text-title-1 font-medium">True North 开发工具</h2>
      <p>通过此页面可以查看控制器差异状态，并执行同步操作。</p>

      <Divider />

      <Tabs
        activeTab={activeTab}
        onChange={(key) => {
          setActiveTab(key);
        }}>

        <Tabs.TabPane key="DesktopControllerDiff" title="Desktop 控制器差异">
          <DesktopControllerTab isActive={activeTab === 'DesktopControllerDiff'} />
        </Tabs.TabPane>
        <Tabs.TabPane key="ApiControllerDiff" title="API 控制器差异">
          <ApiControllerTab isActive={activeTab === 'ApiControllerDiff'} />
        </Tabs.TabPane>
        <Tabs.TabPane key="WebServiceDiff" title="Web Service 差异">
          <WebServiceTab isActive={activeTab === 'WebServiceDiff'} />
        </Tabs.TabPane>
      </Tabs>
    </div>);

};

export default DevToolsPage;