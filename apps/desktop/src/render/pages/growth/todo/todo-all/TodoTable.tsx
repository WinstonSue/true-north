import type { TableColumnProps } from '@sue/design-web-react';
import { Table, Button, Modal, message } from '@sue/design-web-react';
import dayjs from 'dayjs';
import { URGENCY_MAP, IMPORTANCE_MAP } from '../../constants';
import { useTodoAllContext } from './context';
import { useEffect, useState } from 'react';
import { TodoService } from '@true-north/web-service';
import { openModal } from '@/hooks/OpenModal';
import { TodoEditor } from '../../components';
import { TodoRelatedType, TodoStatus } from '@true-north/enum';

import { TodoVo } from '@true-north/vo';

export default function TodoTable() {
  const { todoList, getTodoPage } = useTodoAllContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    getTodoPage();
  }, []);

  const handleBatchDone = async () => {
    const selectedTodos = todoList.filter((todo) => selectedRowKeys.includes(todo.id));
    if (!selectedTodos.length) return;
    if (selectedTodos.length > 50) {
      message.error('单次最多完成 50 条待办');
      return;
    }
    try {
      setBatchLoading(true);
      await TodoService.doneBatch({
        todoWithRepeatList: selectedTodos.map((todo) => ({ id: todo.id, relatedType: todo.relatedType })),
      });
      setSelectedRowKeys([]);
      await getTodoPage();
    } finally {
      setBatchLoading(false);
    }
  };

  const columns: TableColumnProps<TodoVo>[] = [
    { title: '待办', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        switch (record.status) {
          case TodoStatus.DONE:
            return (
              <div className="text-success">
                已完成({dayjs(record.doneAt).format('YY-MM-DD HH:mm')})
              </div>
            );
          case TodoStatus.TODO:
            return <div className="text-warning">未完成</div>;
          case TodoStatus.ABANDONED:
            return (
              <div className="text-danger">
                已放弃({dayjs(record.abandonedAt).format('YY-MM-DD HH:mm')})
              </div>
            );
          default:
            return '--';
        }
      },
    },
    {
      title: '计划日期',
      key: 'planDate',
      render: (_, record) => (
        <div>
          {dayjs(record.planDate).format('YYYY-MM-DD')}
          {record.planStartTime &&
            record.planEndTime &&
            `${dayjs(record.planStartTime).format('HH:mm')}
             - ${dayjs(record.planEndTime).format('HH:mm')}`}
        </div>
      ),
    },
    {
      title: '紧急程度',
      key: 'urgency',
      render: (_, record) => (
        <div>{URGENCY_MAP.get(record.urgency)?.label || '--'}</div>
      ),
    },
    {
      title: '重要程度',
      key: 'importance',
      render: (_, record) => (
        <div>{IMPORTANCE_MAP.get(record.importance)?.label || '--'}</div>
      ),
    },
    { title: '标签', dataIndex: 'tags', key: 'tags' },
    {
      title: <span className="text-text-1 font-medium px-4">操作</span>,
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            type="text"
            onClick={() => {
              openModal({
                title: <div className="text-body-3">编辑</div>,
                content: (
                  <div className="ml-[-6px]">
                    <TodoEditor
                      todo={record}
                      onClose={null}
                      afterSubmit={async () => {
                        await getTodoPage();
                      }}
                    />
                  </div>
                ),
                onCancel: () => {
                  getTodoPage();
                },
              });
            }}
          >
            编辑
          </Button>
          {record.status === TodoStatus.TODO && (
            <Button
              type="text"
              onClick={async () => {
                await TodoService.start(record.relatedType || TodoRelatedType.NONE, record.id);
                await getTodoPage();
              }}
            >
              开始
            </Button>
          )}
          {record.status === TodoStatus.IN_PROGRESS && (
            <Button
              type="text"
              onClick={async () => {
                await TodoService.pause(record.relatedType || TodoRelatedType.NONE, record.id);
                await getTodoPage();
              }}
            >
              暂停
            </Button>
          )}
          <Button
            type="text"
            onClick={() =>
              Modal.confirm({
                title: '确定删除吗？',
                content: '删除后将无法恢复',
                onOk: async () => {
                  await TodoService.delete(record.relatedType || TodoRelatedType.NONE, record.id);
                  await getTodoPage();
                },
              })
            }
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3">
        <Button
          type="primary"
          disabled={!selectedRowKeys.length}
          loading={batchLoading}
          onClick={handleBatchDone}
        >
          批量完成{selectedRowKeys.length ? ` (${selectedRowKeys.length})` : ''}
        </Button>
      </div>
      <Table
        className="w-full"
        columns={columns}
        data={todoList}
        pagination={false}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys.map(String)),
          getCheckboxProps: (record: TodoVo) => ({
            disabled: record.status !== TodoStatus.TODO && record.status !== TodoStatus.IN_PROGRESS,
          }),
        }}
      />
    </>
  );
}
