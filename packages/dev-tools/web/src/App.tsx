import React from 'react'
import { ConfigProvider, Layout, theme } from 'antd'
import DevToolsPage from './components/DevToolsPage'

const { Content } = Layout

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px' }}>
          <DevToolsPage />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
