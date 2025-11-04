import React from 'react'
import { ConfigProvider, Layout } from '@arco-design/web-react'
import DevToolsPage from './components/DevToolsPage'

const { Content } = Layout

function App() {
  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px' }}>
          <DevToolsPage />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
