# Custom trigger

## Source

```tsx
import { PanelLeftClose, PanelLeftOpen, Upload as UploadIcon, User, Video } from 'lucide-react'
import React, { useState } from 'react';
;
import { Button, Layout, Menu, theme } from '@sue/design-web-react';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <User  />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <Video  />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadIcon  />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <PanelLeftOpen  /> : <PanelLeftClose  />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
```
