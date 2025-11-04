import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Divider, message, Spin, Table, Tag, Alert, Tabs } from 'antd'
import { SyncOutlined, PlayCircleOutlined, EyeOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons'
import MethodDetailsModal from './MethodDetailsModal'

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

interface MethodChange {
  methodName: string
  changeType: 'signature_changed' | 'parameters_changed' | 'decorators_changed' | 'body_changed' | 'no_change'
  sourceMethod: any
  targetMethod?: any
  details: string
}

interface ControllerSyncStatus {
  className: string
  filePath: string
  needsSync: boolean
  changes: MethodChange[]
  summary: {
    totalMethods: number
    changedMethods: number
    addedMethods: number
    signatureChanges: number
    parameterChanges: number
    decoratorChanges: number
    bodyChanges: number
  }
}

interface MethodDetails {
  controllers: ControllerSyncStatus[]
  lastChecked: string
}

const syncOperations: SyncOperation[] = [
  {
    id: 'sync-controllers',
    name: '同步 Controllers',
    description: '同步业务控制器代码，生成 API 接口和目标代码控制器',
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
  const [methodDetails, setMethodDetails] = useState<MethodDetails | null>(null)
  const [methodDetailsLoading, setMethodDetailsLoading] = useState(false)
  const [selectedController, setSelectedController] = useState<ControllerSyncStatus | null>(null)
  const [methodModalVisible, setMethodModalVisible] = useState(false)
  
  // API 控制器相关状态
  const [apiMethodDetails, setApiMethodDetails] = useState<MethodDetails | null>(null)
  const [apiMethodDetailsLoading, setApiMethodDetailsLoading] = useState(false)
  const [selectedApiController, setSelectedApiController] = useState<ControllerSyncStatus | null>(null)
  const [apiMethodModalVisible, setApiMethodModalVisible] = useState(false)

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
      const response = await fetch('/api/v2/check/controllers')
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

  const checkMethodDetails = async () => {
    setMethodDetailsLoading(true)
    try {
      const response = await fetch('/api/check/method-details')
      const result = await response.json()
      
      if (result.success) {
        setMethodDetails(result.data)
        message.success('方法详情检查完成')
      } else {
        message.error(`方法详情检查失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`方法详情检查失败: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setMethodDetailsLoading(false)
    }
  }

  const syncController = async (className: string) => {
    try {
      const response = await fetch('/api/v2/sync/controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: className }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        message.success(result.message || `${className} 同步完成`)
        // 重新检查状态
        await checkMethodDetails()
      } else {
        message.error(`同步失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`同步失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // API 控制器相关函数
  const checkApiMethodDetails = async () => {
    setApiMethodDetailsLoading(true)
    try {
      const response = await fetch('/api/v3/check/api-method-details')
      const result = await response.json()
      
      if (result.success) {
        setApiMethodDetails(result.data)
        message.success('API 控制器方法详情检查完成')
      } else {
        message.error(`API 控制器方法详情检查失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`API 控制器方法详情检查失败: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setApiMethodDetailsLoading(false)
    }
  }

  const syncApiController = async (className: string) => {
    try {
      const response = await fetch('/api/v3/sync/api-controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: className }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        message.success(result.message || `API 控制器 ${className} 同步完成`)
        // 重新检查状态
        await checkApiMethodDetails()
      } else {
        message.error(`API 控制器同步失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`API 控制器同步失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const showMethodDetails = (controller: ControllerSyncStatus) => {
    setSelectedController(controller)
    setMethodModalVisible(true)
  }

  const showApiMethodDetails = (controller: ControllerSyncStatus) => {
    setSelectedApiController(controller)
    setApiMethodModalVisible(true)
  }

  useEffect(() => {
    // 页面加载时自动检查一次状态
    checkControllerStatus()
    checkMethodDetails()
    checkApiMethodDetails()
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

  const renderMethodDetailsTable = () => {
    if (!methodDetails) return null

    const columns = [
      {
        title: 'Controller',
        dataIndex: 'className',
        key: 'className',
        render: (className: string, record: ControllerSyncStatus) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{className}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.filePath}</div>
          </div>
        ),
      },
      {
        title: '同步状态',
        key: 'syncStatus',
        render: (record: ControllerSyncStatus) => (
          <Space direction="vertical" size="small">
            <div>
              {record.needsSync ? (
                <Tag color="orange" icon={<ExclamationCircleOutlined />}>需要同步</Tag>
              ) : (
                <Tag color="green" icon={<CheckCircleOutlined />}>已同步</Tag>
              )}
            </div>
          </Space>
        ),
      },
      {
        title: '方法统计',
        key: 'methodStats',
        render: (record: ControllerSyncStatus) => (
          <Space wrap>
            <Tag>总计: {record.summary.totalMethods}</Tag>
            {record.summary.changedMethods > 0 && (
              <Tag color="orange">变更: {record.summary.changedMethods}</Tag>
            )}
            {record.summary.addedMethods > 0 && (
              <Tag color="blue">新增: {record.summary.addedMethods}</Tag>
            )}
            {record.summary.parameterChanges > 0 && (
              <Tag color="purple">参数: {record.summary.parameterChanges}</Tag>
            )}
            {record.summary.decoratorChanges > 0 && (
              <Tag color="gold">装饰器: {record.summary.decoratorChanges}</Tag>
            )}
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'actions',
        render: (record: ControllerSyncStatus) => (
          <Space>
            <Button
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={() => showMethodDetails(record)}
            >
              查看详情
            </Button>
            {record.needsSync && (
              <Button
                size="small"
                type="primary"
                icon={<SyncOutlined />}
                onClick={() => syncController(record.className)}
              >
                同步
              </Button>
            )}
          </Space>
        ),
      },
    ]

    const needsSyncCount = methodDetails.controllers.filter(c => c.needsSync).length

    return (
      <div style={{ marginTop: 24 }}>
        <Card
          title={
            <Space>
              <span>方法级别差异检查</span>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                loading={methodDetailsLoading}
                onClick={checkMethodDetails}
              >
                刷新
              </Button>
            </Space>
          }
          extra={
            <Space>
              <span>总计: {methodDetails.controllers.length}</span>
              <span>需要同步: {needsSyncCount}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                最后检查: {new Date(methodDetails.lastChecked).toLocaleString()}
              </span>
            </Space>
          }
        >
          {needsSyncCount > 0 && (
            <Alert
              message={`发现 ${needsSyncCount} 个控制器需要同步`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Table
            columns={columns}
            dataSource={methodDetails.controllers}
            rowKey="className"
            size="small"
            pagination={{ pageSize: 10 }}
            loading={methodDetailsLoading}
          />
        </Card>
      </div>
    )
  }

  const renderApiMethodDetailsTable = () => {
    if (!apiMethodDetails) return null

    const columns = [
      {
        title: 'API Controller',
        dataIndex: 'className',
        key: 'className',
        render: (className: string, record: ControllerSyncStatus) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{className}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.filePath}</div>
          </div>
        ),
      },
      {
        title: '同步状态',
        key: 'syncStatus',
        render: (record: ControllerSyncStatus) => (
          <Space direction="vertical" size="small">
            <div>
              {record.needsSync ? (
                <Tag color="orange" icon={<ExclamationCircleOutlined />}>需要同步</Tag>
              ) : (
                <Tag color="green" icon={<CheckCircleOutlined />}>已同步</Tag>
              )}
            </div>
          </Space>
        ),
      },
      {
        title: 'API 方法统计',
        key: 'methodStats',
        render: (record: ControllerSyncStatus) => (
          <Space wrap>
            <Tag>总计: {record.summary.totalMethods}</Tag>
            {record.summary.changedMethods > 0 && (
              <Tag color="orange">变更: {record.summary.changedMethods}</Tag>
            )}
            {record.summary.addedMethods > 0 && (
              <Tag color="blue">新增: {record.summary.addedMethods}</Tag>
            )}
            {record.summary.parameterChanges > 0 && (
              <Tag color="purple">参数: {record.summary.parameterChanges}</Tag>
            )}
            {record.summary.decoratorChanges > 0 && (
              <Tag color="gold">装饰器: {record.summary.decoratorChanges}</Tag>
            )}
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'actions',
        render: (record: ControllerSyncStatus) => (
          <Space>
            <Button
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={() => showApiMethodDetails(record)}
            >
              查看详情
            </Button>
            {record.needsSync && (
              <Button
                size="small"
                type="primary"
                icon={<SyncOutlined />}
                onClick={() => syncApiController(record.className)}
              >
                同步
              </Button>
            )}
          </Space>
        ),
      },
    ]

    const needsSyncCount = apiMethodDetails.controllers.filter(c => c.needsSync).length

    return (
      <div style={{ marginTop: 24 }}>
        <Card
          title={
            <Space>
              <span>API 控制器方法级别差异检查</span>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                loading={apiMethodDetailsLoading}
                onClick={checkApiMethodDetails}
              >
                刷新
              </Button>
            </Space>
          }
          extra={
            <Space>
              <span>总计: {apiMethodDetails.controllers.length}</span>
              <span>需要同步: {needsSyncCount}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                最后检查: {new Date(apiMethodDetails.lastChecked).toLocaleString()}
              </span>
            </Space>
          }
        >
          {needsSyncCount > 0 && (
            <Alert
              message={`发现 ${needsSyncCount} 个 API 控制器需要同步`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Table
            columns={columns}
            dataSource={apiMethodDetails.controllers}
            rowKey="className"
            size="small"
            pagination={{ pageSize: 10 }}
            loading={apiMethodDetailsLoading}
          />
        </Card>
      </div>
    )
  }

  const tabItems = [
    {
      key: 'operations',
      label: '同步操作',
      children: (
        <div>
          <Title level={3}>同步操作</Title>
          {syncOperations
            .filter(op => op.type === 'sync')
            .map(renderOperationCard)}
          
          <Title level={3}>监听任务</Title>
          {syncOperations
            .filter(op => op.type === 'watch')
            .map(renderOperationCard)}
        </div>
      )
    },
    {
      key: 'method-details',
      label: 'Desktop 控制器差异',
      children: renderMethodDetailsTable()
    },
    {
      key: 'api-method-details',
      label: 'API 控制器差异',
      children: renderApiMethodDetailsTable()
    }
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Life Toolkit 开发工具</Title>
      <Paragraph>
        通过此页面可以执行各种开发辅助操作，包括同步控制器、DTO 等代码生成任务。
      </Paragraph>
      
      <Divider />
      
      <Tabs defaultActiveKey="api-method-details" items={tabItems} />
      
      <MethodDetailsModal
        visible={methodModalVisible}
        onClose={() => setMethodModalVisible(false)}
        controller={selectedController}
        onSync={syncController}
      />
      
      <MethodDetailsModal
        visible={apiMethodModalVisible}
        onClose={() => setApiMethodModalVisible(false)}
        controller={selectedApiController}
        onSync={syncApiController}
      />
    </div>
  )
}

export default DevToolsPage
