import React, { useState } from 'react';
import { Card, Button, Space, Message, Table, Tag, Alert } from '@arco-design/web-react';
import { IconSync, IconCheckCircle, IconExclamationCircle, IconRefresh, IconList } from '@arco-design/web-react/icon';
import MethodDetailsModal from './MethodDetailsModal';
import { ControllerSyncStatus } from '../../../types';

interface MethodDetails {
  controllers: ControllerSyncStatus[];
  lastChecked: string;
}

interface WebServiceTabProps {
  isActive?: boolean;
}

const WebServiceTab: React.FC<WebServiceTabProps> = ({ isActive = false }) => {
  const [webServiceMethodDetails, setWebServiceMethodDetails] = useState<MethodDetails | null>(null);
  const [webServiceMethodDetailsLoading, setWebServiceMethodDetailsLoading] = useState(false);
  const [selectedWebServiceController, setSelectedWebServiceController] = useState<ControllerSyncStatus | null>(null);
  const [webServiceMethodModalVisible, setWebServiceMethodModalVisible] = useState(false);

  const checkWebServiceMethodDetails = async () => {
    setWebServiceMethodDetailsLoading(true);
    try {
      const response = await fetch('/api/check/web-service-method-details');
      const result = await response.json();

      if (result.success) {
        setWebServiceMethodDetails(result.data);
      } else {
        Message.error(`Web Service 方法详情检查失败: ${result.error}`);
      }
    } catch (error) {
      Message.error(`Web Service 方法详情检查失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setWebServiceMethodDetailsLoading(false);
    }
  };

  const syncWebServiceController = async (className: string) => {
    try {
      // 从类名中提取控制器名称，如 "TodoService" -> "todo"
      const controllerName = className.replace('Service', '').toLowerCase();

      const response = await fetch('/api/sync/web-service-controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: controllerName }),
      });

      const result = await response.json();

      if (result.success) {
        Message.success(result.message || `Web Service ${className} 同步完成`);
        // 重新检查状态
        await checkWebServiceMethodDetails();
      } else {
        Message.error(`Web Service 同步失败: ${result.error}`);
      }
    } catch (error) {
      Message.error(`Web Service 同步失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const showWebServiceMethodDetails = (controller: ControllerSyncStatus) => {
    setSelectedWebServiceController(controller);
    setWebServiceMethodModalVisible(true);
  };

  // 组件挂载时调用父组件的 onLoad，只有当 tab 激活时才加载数据
  React.useEffect(() => {
    if (isActive) {
      checkWebServiceMethodDetails();
    }
  }, [isActive]);

  if (!webServiceMethodDetails) return null;

  const columns = [
    {
      title: 'Web Service',
      dataIndex: 'className',
      key: 'className',
      render: (className: string, record: ControllerSyncStatus) => {
        if (!record) return null;
        return (
          <div>
            <div style={{ fontWeight: 'bold' }}>{className}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.targetPath}</div>
          </div>
        );
      },
    },
    {
      title: '同步状态',
      key: 'syncStatus',
      render: (className: string, record: ControllerSyncStatus) => {
        if (!record) return null;
        return (
          <Space direction="vertical" size="small">
            <div>
              {record.needsSync ? (
                <Tag color="orange" icon={<IconExclamationCircle />}>
                  需要同步
                </Tag>
              ) : (
                <Tag color="green" icon={<IconCheckCircle />}>
                  已同步
                </Tag>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Service 方法统计',
      key: 'methodStats',
      render: (className: string, record: ControllerSyncStatus) => {
        if (!record || !record.summary) return null;
        return (
          <Space wrap>
            <Tag>总计: {record.summary.totalMethods}</Tag>
            {record.summary.changedMethods > 0 && <Tag color="orange">变更: {record.summary.changedMethods}</Tag>}
            {record.summary.addedMethods > 0 && <Tag color="blue">新增: {record.summary.addedMethods}</Tag>}
            {record.summary.parameterChanges > 0 && <Tag color="purple">参数: {record.summary.parameterChanges}</Tag>}
            {record.summary.decoratorChanges > 0 && <Tag color="gold">装饰器: {record.summary.decoratorChanges}</Tag>}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      render: (className: string, record: ControllerSyncStatus) => {
        if (!record) return null;
        return (
          <Space>
            <Button size="small" icon={<IconList />} onClick={() => showWebServiceMethodDetails(record)}>
              查看详情
            </Button>
            {record.needsSync && (
              <Button
                size="small"
                type="primary"
                icon={<IconSync />}
                onClick={() => syncWebServiceController(record.className)}
              >
                同步
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const needsSyncCount = webServiceMethodDetails.controllers?.filter((c) => c?.needsSync).length || 0;

  return (
    <div style={{ marginTop: 24 }}>
      <Card
        title={
          <Space>
            <span>Web Service 方法级别差异检查</span>
            <Button
              size="small"
              icon={<IconRefresh />}
              loading={webServiceMethodDetailsLoading}
              onClick={checkWebServiceMethodDetails}
            >
              刷新
            </Button>
          </Space>
        }
        extra={
          <Space>
            <span>总计: {webServiceMethodDetails.controllers?.length || 0}</span>
            <span>需要同步: {needsSyncCount}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              最后检查:{' '}
              {webServiceMethodDetails.lastChecked
                ? new Date(webServiceMethodDetails.lastChecked).toLocaleString()
                : '未知'}
            </span>
          </Space>
        }
      >
        {needsSyncCount > 0 && (
          <Alert
            content={`发现 ${needsSyncCount} 个 Web Service 需要同步`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          data={webServiceMethodDetails.controllers || []}
          rowKey="className"
          size="small"
          pagination={{ pageSize: 10 }}
          loading={webServiceMethodDetailsLoading}
        />
      </Card>

      <MethodDetailsModal
        visible={webServiceMethodModalVisible}
        onClose={() => setWebServiceMethodModalVisible(false)}
        controller={selectedWebServiceController}
        onSync={syncWebServiceController}
      />
    </div>
  );
};

export default WebServiceTab;
