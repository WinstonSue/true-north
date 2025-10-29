import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Divider, message, Spin, Table, Tag, Collapse, Alert } from 'antd'
import { SyncOutlined, PlayCircleOutlined, EyeOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

interface SyncOperation {
  id: string
  name: string
  description: string
  command: string
  type: 'sync' | 'watch'
}

interface ControllerStatus {
  serverPath: string
  relativePath: string
  className: string | null
  serviceTypes: string[]
  desktop: {
    exists: boolean
    path: string
    needsSync: boolean
    issues: string[]
  }
  api: {
    exists: boolean
    path: string
    needsSync: boolean
    issues: string[]
  }
}

interface SyncStatus {
  totalControllers: number
  needsSyncCount: number
  controllers: ControllerStatus[]
  lastChecked: string
}

const syncOperations: SyncOperation[] = [
  {
    id: 'sync-controllers',
    name: '同步 Controllers',
    description: '同步业务控制器代码，生成 API 接口和桌面端控制器',
    command: 'sync:controllers',
    type: 'sync'
  },
  {
    id: 'watch-controllers',
    name: '监听 Controllers',
    description: '监听业务控制器变化，自动同步生成代码',
    command: 'watch:controllers',
    type: 'watch'
  },
  {
    id: 'sync-dto',
    name: '同步 DTO',
    description: '同步 DTO 定义，生成 VO 类型和表单类型',
    command: 'sync:dto',
    type: 'sync'
  },
  {
    id: 'watch-dto',
    name: '监听 DTO',
    description: '监听 DTO 变化，自动同步生成类型定义',
    command: 'watch:dto',
    type: 'watch'
  }
]

const DevToolsPage: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [watchingTasks, setWatchingTasks] = useState<Set<string>>(new Set())
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const executeCommand = async (operation: SyncOperation) => {
    const { id, command, type } = operation
    
    setLoading(prev => ({ ...prev, [id]: true }))
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command, type, taskId: id }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        if (type === 'sync') {
          message.success(`${operation.name} 执行成功`)
        } else {
          setWatchingTasks(prev => new Set([...prev, id]))
          message.success(`${operation.name} 已启动`)
        }
      } else {
        message.error(`${operation.name} 执行失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`执行失败: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const stopWatching = async (operation: SyncOperation) => {
    try {
      const response = await fetch('/api/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: operation.id }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setWatchingTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(operation.id)
          return newSet
        })
        message.success(`${operation.name} 已停止`)
      } else {
        message.error(`停止失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`停止失败: ${error}`)
    }
  }

  const checkControllerStatus = async () => {
    setStatusLoading(true)
    try {
      const response = await fetch('/api/check/controllers')
      const result = await response.json()
      
      if (result.success) {
        setSyncStatus(result.data)
        message.success('状态检查完成')
      } else {
        message.error(`状态检查失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`状态检查失败: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setStatusLoading(false)
    }
  }

  useEffect(() => {
    // 页面加载时自动检查一次状态
    checkControllerStatus()
  }, [])

  const renderOperationCard = (operation: SyncOperation) => {
    const isLoading = loading[operation.id]
    const isWatching = watchingTasks.has(operation.id)
    
    return (
      <Card
        key={operation.id}
        title={operation.name}
        style={{ marginBottom: 16 }}
        extra={
          operation.type === 'sync' ? (
            <SyncOutlined style={{ color: '#1890ff' }} />
          ) : (
            <EyeOutlined style={{ color: '#52c41a' }} />
          )
        }
      >
        <Paragraph>{operation.description}</Paragraph>
        <Space>
          {operation.type === 'sync' ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={isLoading}
              onClick={() => executeCommand(operation)}
            >
              执行同步
            </Button>
          ) : (
            <>
              {!isWatching ? (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  loading={isLoading}
                  onClick={() => executeCommand(operation)}
                >
                  启动监听
                </Button>
              ) : (
                <Button
                  danger
                  onClick={() => stopWatching(operation)}
                >
                  停止监听
                </Button>
              )}
              {isWatching && (
                <Spin size="small" />
              )}
            </>
          )}
        </Space>
      </Card>
    )
  }

  const renderStatusTable = () => {
    if (!syncStatus) return null

    const columns = [
      {
        title: 'Controller',
        dataIndex: 'relativePath',
        key: 'relativePath',
        render: (path: string, record: ControllerStatus) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.className || '未知类'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{path}</div>
          </div>
        ),
      },
      {
        title: 'Desktop',
        key: 'desktop',
        render: (record: ControllerStatus) => (
          <Space direction="vertical" size="small">
            <div>
              {record.desktop.exists ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>存在</Tag>
              ) : (
                <Tag color="red" icon={<ExclamationCircleOutlined />}>不存在</Tag>
              )}
              {record.desktop.needsSync && (
                <Tag color="orange">需要同步</Tag>
              )}
            </div>
            {record.desktop.issues.length > 0 && (
              <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                {record.desktop.issues.join(', ')}
              </div>
            )}
          </Space>
        ),
      },
      {
        title: 'API',
        key: 'api',
        render: (record: ControllerStatus) => (
          <Space direction="vertical" size="small">
            <div>
              {record.api.exists ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>存在</Tag>
              ) : (
                <Tag color="red" icon={<ExclamationCircleOutlined />}>不存在</Tag>
              )}
              {record.api.needsSync && (
                <Tag color="orange">需要同步</Tag>
              )}
            </div>
            {record.api.issues.length > 0 && (
              <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                {record.api.issues.join(', ')}
              </div>
            )}
          </Space>
        ),
      },
      {
        title: '服务类型',
        dataIndex: 'serviceTypes',
        key: 'serviceTypes',
        render: (types: string[]) => (
          <div>
            {types.map(type => (
              <Tag key={type} color="blue" style={{ marginBottom: 4 }}>
                {type}
              </Tag>
            ))}
          </div>
        ),
      },
    ]

    return (
      <div style={{ marginTop: 24 }}>
        <Card
          title={
            <Space>
              <span>Controllers 状态检查</span>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                loading={statusLoading}
                onClick={checkControllerStatus}
              >
                刷新
              </Button>
            </Space>
          }
          extra={
            <Space>
              <span>总计: {syncStatus.totalControllers}</span>
              <span>需要同步: {syncStatus.needsSyncCount}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                最后检查: {new Date(syncStatus.lastChecked).toLocaleString()}
              </span>
            </Space>
          }
        >
          {syncStatus.needsSyncCount > 0 && (
            <Alert
              message={`发现 ${syncStatus.needsSyncCount} 个控制器需要同步`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Table
            columns={columns}
            dataSource={syncStatus.controllers}
            rowKey="serverPath"
            size="small"
            pagination={{ pageSize: 10 }}
            loading={statusLoading}
          />
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Life Toolkit 开发工具</Title>
      <Paragraph>
        通过此页面可以执行各种开发辅助操作，包括同步控制器、DTO 等代码生成任务。
      </Paragraph>
      
      <Divider />
      
      <Title level={3}>同步操作</Title>
      {syncOperations
        .filter(op => op.type === 'sync')
        .map(renderOperationCard)}
      
      <Title level={3}>监听任务</Title>
      {syncOperations
        .filter(op => op.type === 'watch')
        .map(renderOperationCard)}
      
      {renderStatusTable()}
    </div>
  )
}

export default DevToolsPage
