import React, { useState } from 'react';
import { Card, Button, Space, Message, Table, Tag, Alert } from '@arco-design/web-react';
import { IconSync, IconCheckCircle, IconExclamationCircle, IconRefresh, IconList } from '@arco-design/web-react/icon';
import MethodDetailsModal from './MethodDetailsModal';
import { MethodChange } from '../../../types';

interface ControllerSyncStatus {
  className: string;
  filePath: string;
  needsSync: boolean;
  changes: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    signatureChanges: number;
    parameterChanges: number;
    decoratorChanges: number;
    bodyChanges: number;
  };
}

interface MethodDetails {
  controllers: ControllerSyncStatus[];
  lastChecked: string;
}

interface ApiControllerTabProps {
  isActive?: boolean;
}

const ApiControllerTab: React.FC<ApiControllerTabProps> = ({ isActive = false }) => {
  const [apiMethodDetails, setApiMethodDetails] = useState<MethodDetails | null>(null);
  const [apiMethodDetailsLoading, setApiMethodDetailsLoading] = useState(false);
  const [selectedApiController, setSelectedApiController] = useState<ControllerSyncStatus | null>(null);
  const [apiMethodModalVisible, setApiMethodModalVisible] = useState(false);

  const checkApiMethodDetails = async () => {
    setApiMethodDetailsLoading(true);
    try {
      const response = await fetch('/api/check/api-method-details');
      const result = await response.json();

      if (result.success) {
        setApiMethodDetails(result.data);
      } else {
        Message.error(`API 控制器方法详情检查失败: ${result.error}`);
      }
    } catch (error) {
      Message.error(`API 控制器方法详情检查失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setApiMethodDetailsLoading(false);
    }
  };

  const syncApiController = async (className: string) => {
    try {
      // 从类名中提取控制器名称，如 "Todo.controllerController" -> "todo"
      const controllerName = className.replace('.controllerController', '').toLowerCase();

      const response = await fetch('/api/sync/api-controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: controllerName }),
      });

      const result = await response.json();

      if (result.success) {
        Message.success(result.message || `API 控制器 ${className} 同步完成`);
        // 重新检查状态
        await checkApiMethodDetails();
      } else {
        Message.error(`API 控制器同步失败: ${result.error}`);
      }
    } catch (error) {
      Message.error(`API 控制器同步失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const showApiMethodDetails = (controller: ControllerSyncStatus) => {
    console.log('controller', controller);
    setSelectedApiController(controller);
    setApiMethodModalVisible(true);
  };

  // 组件挂载时调用父组件的 onLoad，只有当 tab 激活时才加载数据
  React.useEffect(() => {
    if (isActive) {
      checkApiMethodDetails();
    }
  }, [isActive]);

  if (!apiMethodDetails) return null;

  const columns = [
    {
      title: 'API Controller',
      dataIndex: 'className',
      key: 'className',
      render: (className: string, record: ControllerSyncStatus) => {
        if (!record) return null;
        return (
          <div>
            <div style={{ fontWeight: 'bold' }}>{className}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.filePath}</div>
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
      title: 'API 方法统计',
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
            <Button size="small" icon={<IconList />} onClick={() => showApiMethodDetails(record)}>
              查看详情
            </Button>
            {record.needsSync && (
              <Button
                size="small"
                type="primary"
                icon={<IconSync />}
                onClick={() => syncApiController(record.className)}
              >
                同步
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const needsSyncCount = apiMethodDetails.controllers?.filter((c) => c?.needsSync).length || 0;

  return (
    <div style={{ marginTop: 24 }}>
      <Card
        title={
          <Space>
            <span>API 控制器方法级别差异检查</span>
            <Button
              size="small"
              icon={<IconRefresh />}
              loading={apiMethodDetailsLoading}
              onClick={checkApiMethodDetails}
            >
              刷新
            </Button>
          </Space>
        }
        extra={
          <Space>
            <span>总计: {apiMethodDetails.controllers?.length || 0}</span>
            <span>需要同步: {needsSyncCount}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              最后检查:{' '}
              {apiMethodDetails.lastChecked ? new Date(apiMethodDetails.lastChecked).toLocaleString() : '未知'}
            </span>
          </Space>
        }
      >
        {needsSyncCount > 0 && (
          <Alert
            content={`发现 ${needsSyncCount} 个 API 控制器需要同步`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          data={apiMethodDetails.controllers || []}
          rowKey="className"
          size="small"
          pagination={{ pageSize: 10 }}
          loading={apiMethodDetailsLoading}
        />
      </Card>

      <MethodDetailsModal
        visible={apiMethodModalVisible}
        onClose={() => setApiMethodModalVisible(false)}
        controller={selectedApiController}
        onSync={syncApiController}
      />
    </div>
  );
};

export default ApiControllerTab;
