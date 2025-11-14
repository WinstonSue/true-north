import React, { useState } from 'react';
import { Typography, Divider, Tabs } from '@arco-design/web-react';
import DesktopControllerTab from './DesktopControllerTab';
import ApiControllerTab from './ApiControllerTab';
import WebServiceTab from './WebServiceTab';

const { Title, Paragraph } = Typography;

const DevToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('method-details');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title heading={2}>Life Toolkit 开发工具</Title>
      <Paragraph>通过此页面可以查看控制器差异状态，并执行同步操作。</Paragraph>

      <Divider />

      <Tabs
        activeTab={activeTab}
        onChange={(key) => {
          setActiveTab(key);
        }}
      >
        <Tabs.TabPane key="method-details" title="Desktop 控制器差异">
          <DesktopControllerTab isActive={activeTab === 'method-details'} />
        </Tabs.TabPane>
        <Tabs.TabPane key="api-method-details" title="API 控制器差异">
          <ApiControllerTab isActive={activeTab === 'api-method-details'} />
        </Tabs.TabPane>
        <Tabs.TabPane key="web-service-method-details" title="Web Service 差异">
          <WebServiceTab isActive={activeTab === 'web-service-method-details'} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default DevToolsPage;
