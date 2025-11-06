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

interface DesktopControllerTabProps {
  isActive?: boolean;
}

const DesktopControllerTab: React.FC<DesktopControllerTabProps> = ({ isActive = false }) => {
  const [methodDetails, setMethodDetails] = useState<MethodDetails | null>(null);
  const [methodDetailsLoading, setMethodDetailsLoading] = useState(false);
  const [selectedController, setSelectedController] = useState<ControllerSyncStatus | null>(null);
  const [methodModalVisible, setMethodModalVisible] = useState(false);

  const checkMethodDetails = async () => {
    setMethodDetailsLoading(true);
    try {
      const response = await fetch('/api/check/method-details');
      const result = await response.json();

      if (result.success) {
        setMethodDetails(result.data);
      } else {
        Message.error(`方法详情检查失败: ${result.error}`);
      }
    } catch (error) {
      Message.error(`方法详情检查失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setMethodDetailsLoading(false);
    }
  };

  const syncController = async (className: string) => {
    try {
      const response = await fetch('/api/sync/desktop-controller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: className }),
      });

      const result = await response.json();

      if (result.success) {
        Message.success(result.message || `${className} 同步完成`);
        // 重新检查状态
        await checkMethodDetails();
      } else {
        Message.error(`同步失败: ${result.error}`);
      }
    } catch (error) {
      Message.error(`同步失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const showMethodDetails = (controller: ControllerSyncStatus) => {
    setSelectedController(controller);
    setMethodModalVisible(true);
  };

  // 组件挂载时调用父组件的 onLoad，只有当 tab 激活时才加载数据
  React.useEffect(() => {
    if (isActive) {
      checkMethodDetails();
    }
  }, [isActive]);

  if (!methodDetails) return null;

  const columns = [
    {
      title: 'Controller',
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
      title: '方法统计',
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
      dataIndex: 'actions',
      render: (className: string, record: ControllerSyncStatus) => {
        if (!record) return null;
        return (
          <Space>
            <Button size="small" icon={<IconList />} onClick={() => showMethodDetails(record)}>
              查看详情
            </Button>
            {record.needsSync && (
              <Button size="small" type="primary" icon={<IconSync />} onClick={() => syncController(record.className)}>
                同步
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const needsSyncCount = methodDetails.controllers?.filter((c) => c?.needsSync).length || 0;

  return (
    <div style={{ marginTop: 24 }}>
      <Card
        title={
          <Space>
            <span>方法级别差异检查</span>
            <Button size="small" icon={<IconRefresh />} loading={methodDetailsLoading} onClick={checkMethodDetails}>
              刷新
            </Button>
          </Space>
        }
        extra={
          <Space>
            <span>总计: {methodDetails.controllers?.length || 0}</span>
            <span>需要同步: {needsSyncCount}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              最后检查: {methodDetails.lastChecked ? new Date(methodDetails.lastChecked).toLocaleString() : '未知'}
            </span>
          </Space>
        }
      >
        {needsSyncCount > 0 && (
          <Alert
            content={`发现 ${needsSyncCount} 个控制器需要同步`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          data={methodDetails.controllers || []}
          rowKey="className"
          size="small"
          pagination={{ pageSize: 10 }}
          loading={methodDetailsLoading}
        />
      </Card>

      <MethodDetailsModal
        visible={methodModalVisible}
        onClose={() => setMethodModalVisible(false)}
        controller={selectedController}
        onSync={syncController}
      />
    </div>
  );
};

export default DesktopControllerTab;
