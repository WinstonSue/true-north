import React, { useEffect, useState } from 'react';
import { Typography, Divider, Tabs } from 'antd';
import DesktopControllerTab from './DesktopControllerTab';
import ApiControllerTab from './ApiControllerTab';

const { Title, Paragraph } = Typography;

const DevToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api-method-details');

  const tabItems = [
    {
      key: 'method-details',
      label: 'Desktop 控制器差异',
      children: <DesktopControllerTab isActive={activeTab === 'method-details'} />,
    },
    {
      key: 'api-method-details',
      label: 'API 控制器差异',
      children: <ApiControllerTab isActive={activeTab === 'api-method-details'} />,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Life Toolkit 开发工具</Title>
      <Paragraph>通过此页面可以查看控制器差异状态，并执行同步操作。</Paragraph>

      <Divider />

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
        }}
        items={tabItems}
      />
    </div>
  );
};

export default DevToolsPage;
