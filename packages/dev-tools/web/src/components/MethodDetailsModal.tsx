import React from 'react'
import { Modal, Table, Tag, Typography, Space, Collapse, Button, message } from 'antd'
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  SyncOutlined,
  EditOutlined,
  TagOutlined,
  CodeOutlined
} from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

interface MethodChange {
  methodName: string
  changeType: 'signature_changed' | 'parameters_changed' | 'decorators_changed' | 'body_changed' | 'no_change'
  sourceMethod: {
    name: string
    signature: string
    parameters: Array<{
      name: string
      type: string
      decorator?: string
      decoratorArgs?: string
    }>
    decorators: Array<{
      name: string
      args: string
    }>
    body: string
  }
  targetMethod?: {
    name: string
    signature: string
    parameters: Array<{
      name: string
      type: string
      decorator?: string
      decoratorArgs?: string
    }>
    decorators: Array<{
      name: string
      args: string
    }>
    body: string
  }
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

interface MethodDetailsModalProps {
  visible: boolean
  onClose: () => void
  controller: ControllerSyncStatus | null
  onSync: (className: string) => Promise<void>
}

const MethodDetailsModal: React.FC<MethodDetailsModalProps> = ({
  visible,
  onClose,
  controller,
  onSync
}) => {
  if (!controller) return null

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'signature_changed':
        return <EditOutlined style={{ color: '#1890ff' }} />
      case 'parameters_changed':
        return <CodeOutlined style={{ color: '#722ed1' }} />
      case 'decorators_changed':
        return <TagOutlined style={{ color: '#fa8c16' }} />
      case 'body_changed':
        return <SyncOutlined style={{ color: '#52c41a' }} />
      default:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
    }
  }

  const getChangeTypeText = (changeType: string) => {
    switch (changeType) {
      case 'signature_changed':
        return '方法签名变更'
      case 'parameters_changed':
        return '参数变更'
      case 'decorators_changed':
        return '装饰器变更'
      case 'body_changed':
        return '方法体变更'
      default:
        return '无变更'
    }
  }

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'signature_changed':
        return 'blue'
      case 'parameters_changed':
        return 'purple'
      case 'decorators_changed':
        return 'orange'
      case 'body_changed':
        return 'green'
      default:
        return 'default'
    }
  }

  const handleSync = async () => {
    try {
      await onSync(controller.className)
      message.success(`${controller.className} 同步完成`)
      onClose()
    } catch (error) {
      message.error(`同步失败: ${error}`)
    }
  }

  const columns = [
    {
      title: '方法名',
      dataIndex: 'methodName',
      key: 'methodName',
      width: 150,
      render: (name: string) => (
        <Text code>{name}</Text>
      )
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (changeType: string) => (
        <Tag 
          icon={getChangeTypeIcon(changeType)}
          color={getChangeTypeColor(changeType)}
        >
          {getChangeTypeText(changeType)}
        </Tag>
      )
    },
    {
      title: '详细信息',
      dataIndex: 'details',
      key: 'details',
      render: (details: string) => (
        <Text type="secondary">{details}</Text>
      )
    }
  ]

  const renderMethodComparison = (change: MethodChange) => {
    const { sourceMethod, targetMethod } = change

    return (
      <div style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          
          {/* 装饰器比较 */}
          {change.changeType === 'decorators_changed' && (
            <div>
              <Text strong>装饰器对比:</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text type="success">服务端: </Text>
                  <Text code>
                    {sourceMethod.decorators.map(d => `@${d.name}(${d.args})`).join(' ')}
                  </Text>
                </div>
                <div>
                  <Text type="warning">桌面端: </Text>
                  <Text code>
                    {targetMethod?.decorators.map(d => `@${d.name}(${d.args})`).join(' ') || 'N/A'}
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* 参数比较 */}
          {change.changeType === 'parameters_changed' && (
            <div>
              <Text strong>参数对比:</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text type="success">服务端: </Text>
                  <Text code>
                    ({sourceMethod.parameters.map(p => 
                      p.decorator ? `@${p.decorator} ${p.name}: ${p.type}` : `${p.name}: ${p.type}`
                    ).join(', ')})
                  </Text>
                </div>
                <div>
                  <Text type="warning">桌面端: </Text>
                  <Text code>
                    ({targetMethod?.parameters.map(p => 
                      p.decorator ? `@${p.decorator} ${p.name}: ${p.type}` : `${p.name}: ${p.type}`
                    ).join(', ') || 'N/A'})
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* 方法签名比较 */}
          <div>
            <Text strong>方法签名:</Text>
            <div style={{ marginTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <Text type="success">服务端: </Text>
                <Text code style={{ fontSize: '12px' }}>
                  {sourceMethod.signature}
                </Text>
              </div>
              {targetMethod && (
                <div>
                  <Text type="warning">桌面端: </Text>
                  <Text code style={{ fontSize: '12px' }}>
                    {targetMethod.signature}
                  </Text>
                </div>
              )}
            </div>
          </div>

        </Space>
      </div>
    )
  }

  const expandedRowRender = (record: MethodChange) => {
    return renderMethodComparison(record)
  }

  return (
    <Modal
      title={
        <Space>
          <span>{controller.className} - 方法级别差异详情</span>
          {controller.needsSync && (
            <Tag color="orange" icon={<ExclamationCircleOutlined />}>
              需要同步
            </Tag>
          )}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        controller.needsSync && (
          <Button 
            key="sync" 
            type="primary" 
            icon={<SyncOutlined />}
            onClick={handleSync}
          >
            同步此控制器
          </Button>
        )
      ].filter(Boolean)}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        
        {/* 摘要信息 */}
        <div>
          <Text strong>同步摘要:</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              <Tag>总方法数: {controller.summary.totalMethods}</Tag>
              <Tag color="orange">变更方法: {controller.summary.changedMethods}</Tag>
              <Tag color="blue">新增方法: {controller.summary.addedMethods}</Tag>
              <Tag color="purple">参数变更: {controller.summary.parameterChanges}</Tag>
              <Tag color="gold">装饰器变更: {controller.summary.decoratorChanges}</Tag>
              <Tag color="green">方法体变更: {controller.summary.bodyChanges}</Tag>
            </Space>
          </div>
        </div>

        {/* 方法变更列表 */}
        <div>
          <Text strong>方法变更详情:</Text>
          <Table
            columns={columns}
            dataSource={controller.changes.filter(change => change.changeType !== 'no_change')}
            rowKey="methodName"
            size="small"
            pagination={false}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record.changeType !== 'no_change'
            }}
            style={{ marginTop: 8 }}
          />
        </div>

        {controller.changes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">所有方法都已同步，无需更新</Text>
            </div>
          </div>
        )}

      </Space>
    </Modal>
  )
}

export default MethodDetailsModal
